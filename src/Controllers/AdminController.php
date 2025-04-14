<?php

namespace Promulgate\Controllers;

use Josantonius\Session\Session;
use Promulgate\Core\Config;
use Promulgate\Core\GoogleAPIClient;
use Promulgate\Models\AdminModel;
use Promulgate\Models\AgencyModel;

/**
 * Class AdminController
 *
 * @package Promulgate\Controllers
 */
class AdminController extends BaseController
{
	private $adminModel;
	private $agencyModel;
	private $organizationId;
	private $agencyId;

	/**
	 * AdminController constructor.
	 */
	public function __construct()
	{
		if(get_loaded_route_name() === "admin_organization_createnew")
		{
			Session::destroy('organization');
		}
		
		parent::__construct();
		$this->agencyModel = new AgencyModel();
		$this->adminModel = new AdminModel();

	}


	protected function setWebContext()
	{

		$this->view_sub_directory_path = "/admin/";
		$this->Breadcrumbs->add([
			'title' => 'Admin',
			'url'   => url('admin_organization'),
		]);
		$this->setAgencyId(Session::get('agency', 'id'));

		$this->setOrganizationId(Session::get('organization', 'id'));
	}



	private function setAgencyId($agencyId)
	{
		if($agencyId && !is_array($agencyId)) {
			$agencyId       = trim($agencyId);
			$this->agencyId = $agencyId;
		}
	}



	private function setOrganizationId($organizationId)
	{
		if($organizationId && !is_array($organizationId)) {
			$organizationId       = trim($organizationId);
			$this->organizationId = $organizationId;
		}
	}


	public function showOrganizationDetails()
	{
		$this->Breadcrumbs->add([
			'title' => 'Organization',
			'url'   => url('admin_organization'),
		]);

		$organization_details = $this->adminModel->getOrganizationDetails($this->organizationId)['body'];

		if(getValue('status', $organization_details) == 'success') {

			$organization_details = $organization_details['data'];

		} else {
			$organization_details = [];
		}

		$this->setViewData('organization.html',
			[
				'form_action'          => url('admin_ajax'),
				'organization_details' => $organization_details,
				'page_title'           => "Admin Organization",
				'hide_side_menu' => false,  // Show side bar for Organization page
			]
		);
	}

	public function CreateOrganizationDetails()
	{
		$this->Breadcrumbs->add([
			'title' => 'Organization',
			'url'   => url('admin_organization'),
		]);

		Session::destroy('organization');

		$this->setViewData('organization.html',
			[
				'form_action'          => url('admin_ajax'),
				'organization_details' => [],
				'page_title'           => "Admin Organization",
				'hide_side_menu' => false,  // Show side bar for Organization page
			]
		);
	}


	public function showTeam()
	{

		$this->Breadcrumbs->add([
			'title' => 'Team',
			'url'   => url('admin_team_list'),
		]);

		$teams_list = $this->adminModel->getTeamsList($this->organizationId)['body'];
		if(getValue('status', $teams_list) != 'success') {
			$teams_list = [];
		} else {
			$teams_list = getValue('teams', $teams_list['data'], []);
		}

		$final_team_list = [];
		$directors_list  = [];

		//TODO: Propose to return director data from API

		// Separate Director list from results
		foreach($teams_list as $team_member) {
			if(strtolower($team_member['role']['roleName']) == "director") {
				$directors_list[] = $team_member;
			} else {
				$final_team_list[] = $team_member;

			}
		}
		$final_team_list = $this->removeDuplicatesByEmail($final_team_list);
		$this->setViewData('team.html',
			[
				'teams_list'       => $final_team_list,
				'director_details' => reset($directors_list),
				'page_title'       => "Admin Team",
				'hide_side_menu' => false,  // Show side bar for Organization page
			]
		);

	}

	// Helper function to remove duplicates by email
	public function removeDuplicatesByEmail($teams)
	{
		$seen_emails = [];
		$unique_teams = [];

		foreach ($teams as $team_member) {
			if (!in_array($team_member['user']['email'], $seen_emails)) {
				$seen_emails[] = $team_member['user']['email'];
				$unique_teams[] = $team_member;
			}
		}

		return $unique_teams;
	}


	public function showAddTeamMember()
	{

		$this->Breadcrumbs->add([
			'title' => 'Team',
			'url'   => url('admin_team_list'),
		]);

		$this->Breadcrumbs->add([
			'title' => 'Add New',
			'url'   => url('admin_team_add_new_member'),
		]);

		$organization_roles_list = $this->adminModel->getRoles($this->organizationId)['body'];
		$agency_user_list = $this->agencyModel->getTeamsList($this->agencyId)['body'];
		if(getValue('status', $organization_roles_list) != 'success') {
			$organization_roles_list = [];
		} else {
			$organization_roles_list = getValue('data', $organization_roles_list, []);
		}
		if(getValue('status', $agency_user_list) != 'success') {
			$agency_user_list = [];
		} else {
			$agency_user_list = getValue('data', $agency_user_list, []);
		}

		
		$final_organization_roles_list = [];
		// Remove Director from the list
		foreach($organization_roles_list as $role) {

			if(strtolower(trim($role['roleName'])) != 'director') {
				$final_organization_roles_list[] = $role;
			}
		}

		$agency_user_list = $this->removeDuplicateEmails($agency_user_list);
		// Sort agency users alphabetically by email, ensuring trimming and case insensitivity
		usort($agency_user_list, function ($a, $b) {
			$emailA = strtolower(trim($a['email']));
			$emailB = strtolower(trim($b['email']));
			return strcasecmp($emailA, $emailB);
		});
	
		// Sort organization roles alphabetically by roleName, ensuring trimming and case insensitivity
		usort($final_organization_roles_list, function ($a, $b) {
			$roleA = strtolower(trim($a['roleName']));
			$roleB = strtolower(trim($b['roleName']));
			return strcasecmp($roleA, $roleB);
		});

		$this->setViewData('add_new_team_member.html',
			[
				'form_action'             => url('admin_ajax'),
				'organization_roles_list' => $final_organization_roles_list,
				'agency_user_list' => $agency_user_list,
				'page_title'              => "Add new Team",
				'hide_side_menu' => false,  // Show side bar for Organization page

			]
		);

	}

	// Helper function to remove duplicates by email
	public function removeDuplicateEmails($userList){
		$uniqueUsers = [];
    	$emails = [];
		
		foreach ($userList as $user) {
			// Convert email to lowercase and trim spaces to ensure uniqueness
			$email = strtolower(trim($user['email']));
			if (!in_array($email, $emails)) {
				$emails[] = $email;
				$uniqueUsers[] = $user;
			}
		}
		return $uniqueUsers;
	}


	public function showBusiness()
	{

		$this->Breadcrumbs->add([
			'title' => 'Business',
			'url'   => url('admin_business'),
		]);

		$business_details = $this->getBusinessDetails($this->organizationId);

		$this->setViewData('business.html',
			[
				'form_action'      => url('admin_ajax'),
				'page_title'       => "Admin Business",
				'business_details' => $business_details,
				'supported_api_connections' => Config::API_CONFIGURATION_CONNECTIONS,
				'business_details'          => $business_details,
				'plugins_google_youtube'    => true,
				'plugins_google_drive_picker' => true,
				'GOOGLE_APP_ID'               => env('GOOGLE_APP_ID'),
				'GOOGLE_OAUTH_CLIENT_ID'    => env('GOOGLE_OAUTH_CLIENT_ID'),
				'GOOGLE_YOUTUBE_API_KEY'    => env('GOOGLE_YOUTUBE_API_KEY'),
				'GOOGLE_DRIVE_API_KEY'        => env('GOOGLE_DRIVE_API_KEY'),
				'CONNECTION_OAUTH_STATUS'     => json_encode(Session::pull('CONNECTION_OAUTH_STATUS') ?? []),
				'organization_id'				=>Session::get('organization', 'id'),
			]
		);
	}


	public function showConnections()
	{
		$this->Breadcrumbs->add([
			'title' => 'Connections',
			'url'   => url('admin_connections'),
		]);

		$organization_connections = $this->adminModel->getConnectionsList($this->organizationId)['body'] ?? [];
		if(getValue('status', $organization_connections) != 'success') {
			$organization_connections = [];
		} else {
			$organization_connections = getValue('connections', $organization_connections['data'], []);
		}

		$CampaignController = new CampaignController([
			'context' => 'data',
		]);
		$configured_connections = $CampaignController->getSocialMediaConnections(true);

		// Ensure LinkedIn page names are included in configured_connections
		foreach ($configured_connections as $key => $connection) {
			if (strpos($key, 'linkedin') !== false && $connection['isConfigured']) {
				// Fetch LinkedIn page details if not already present
				if (!isset($connection['pageName'])) {
					try {
						$LinkedInClient = new \LinkedIn\Client(env('LINKEDIN_CLIENT_ID'), env('LINKEDIN_CLIENT_SECRET'));
						$LinkedInClient->setAccessToken($connection['accessToken']);
						
						// Fetch organization details
						$organizationId = $connection['organizationId'] ?? null;
						if ($organizationId) {
							$organization = $LinkedInClient->get('organizations/' . $organizationId);
							$configured_connections[$key]['pageName'] = $organization['localizedName'] ?? '';
						}
					} catch (\Exception $e) {
						// Handle error silently or log it
						$configured_connections[$key]['pageName'] = '';
					}
				}
			}
		}

		$final_organization_connections = [];
		$final_organization_connections_titles = [];

		if($organization_connections) {
			foreach($organization_connections as $connection) {
				$unique_name = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $connection['name']));
				$final_organization_connections[$connection['type']][$unique_name] = [
					'name'        => $connection['name'],
					'unique_name' => $unique_name,
					'id'          => $connection['id'] ?? 0,
					'type'        => $connection['type'],
				];
			}

			// For looping in same order
			$final_organization_connections = [
				'ORGANIC' => $final_organization_connections['ORGANIC'] ?? [],
				'PAID'    => $final_organization_connections['PAID'] ?? [],
			];

			$final_organization_connections_titles = [
				'ORGANIC' => "Organic",
				'PAID'    => "Paid",
			];
		}

		$linkedInRedirectUrl = getAbsoluteUrl('oauth_linkedin_callback', NULL, [
			'source' => 'connection',
		], [
			'NO_DEBUG' => true,
		]);

		// added this for local only, server will always have http/https
		if (!str_contains($linkedInRedirectUrl, 'http')) { 
			$linkedInRedirectUrl = 'http://'.$linkedInRedirectUrl;
		}
		$LinkedInClient = new \LinkedIn\Client(env('LINKEDIN_CLIENT_ID'), env('LINKEDIN_CLIENT_SECRET'));
		$LinkedInClient->setRedirectUrl($linkedInRedirectUrl);

		// Saving state in session & validate once we receive authorization code for security
		Session::set('linkedin_oauth_state', $LinkedInClient->getState());

		$this->setViewData('connections.html', [
			'form_action'                     => url('admin_ajax'),
			'page_title'                      => "Admin Connections",
			'organization_connections'        => $final_organization_connections,
			'organization_connections_titles' => $final_organization_connections_titles,
			'supported_api_connections'       => Config::API_CONFIGURATION_CONNECTIONS,
			'configured_connections'          => $configured_connections,
			'plugins_google_youtube'          => true,
			'plugins_facebook'                => true,
			'plugins_linkedin'                => true,
			'facebook_app_id'                 => env('FACEBOOK_APP_ID'),
			'facebook_app_client_id'          => env('FACEBOOK_CLIENT_ID'),
			'facebook_app_client_secret'      => env('FACEBOOK_CLIENT_SECRET'),
			'facebook_graph_api_version'      => env('FACEBOOK_GRAPH_API_VERSION'),
			'GOOGLE_OAUTH_CLIENT_ID'          => env('GOOGLE_OAUTH_CLIENT_ID'),
			'GOOGLE_YOUTUBE_API_KEY'          => env('GOOGLE_YOUTUBE_API_KEY'),
			'linkedin_oauth_authorization_url' => $LinkedInClient->getLoginUrl([
				'r_emailaddress',
				'r_liteprofile',
				'w_member_social',
				'rw_organization_admin',
				'r_organization_social',
				'w_organization_social',
				'w_member_social',
				'r_1st_connections_size'
			]),
			'CONNECTION_OAUTH_STATUS'          => json_encode(Session::pull('CONNECTION_OAUTH_STATUS') ?? []),
		]);
	}


	public function addWhatsapp()
	{

		$this->Breadcrumbs->add([
			'title' => 'Whatsapp Connections',
			'url'   => url('connect_whatsapp'),
		]);

		$whatsapp_details = $this->adminModel->getNewConnectionDetails($this->organizationId, 'WhatsApp')['body'];

		if(getValue('status', $whatsapp_details) == 'success') {

			$whatsapp_details = $whatsapp_details['data'];

		} else {
			$whatsapp_details = [];
		}

		$this->setViewData('whatsapp_connection.html',
			[
				'form_action'                     => url('admin_ajax'),
				'page_title'                      => "Whatsapp Connections",
				'whatsapp_details' => $whatsapp_details
			]
		);
	}

	public function connectGoogleReviews()
	{

		$this->Breadcrumbs->add([
			'title' => 'Google Reviews Connections',
			'url'   => url('connect_google_reviews'),
		]);

		$google_reviews_data = $this->adminModel->getNewConnectionDetails($this->organizationId, 'Google Reviews')['body'];

		if(getValue('status', $google_reviews_data) == 'success') {

			$google_reviews_data = $google_reviews_data['data'];

		} else {
			$google_reviews_data = [];
		}

		$this->setViewData('google_review_connection.html',
			[
				'form_action'                     => url('admin_ajax'),
				'page_title'                      => "Google Reviews Connections",
				'google_reviews_data' => $google_reviews_data
			]
		);
	}


	public function processAjax()
	{
		$all_input                = input()->all();
		$all_input['form_source'] = $all_input['form_source'] ?? "";

		switch ($all_input['form_source']) {

			case 'googledrive':
				$organization_id = $all_input['orgId'] ?? null;

				if ($organization_id) {

					$this->googledrive($organization_id);
				} else {
					$this->adminModel->saveBusinessDetails($all_input);
				}
				break;

			case 'organization' :

				$organization_id = $all_input['organization_id'];

				if($organization_id) {

					$this->updateOrganizationDetails($organization_id, $all_input);

				} else {

					$this->createOrganization($all_input);
				}
				break;

			case 'business' :

				$business_id = $all_input['business_id'];

				if($business_id) {

					$this->updateBusinessDetails($business_id, $all_input);

				} else {

					$this->saveBusiness($all_input);
				}
				break;


			case 'connection_configuration' :

				$connection_type = $all_input['connection_type'] ?? "";
				$this->saveConnectionConfiguration($connection_type, $all_input);

				break;

			case 'update_connection_configuration' :

				$this->updateConnectionConfiguration($all_input, 'isConfigurationRemoved');

				break;

			case 'update_connection_status' :

				$this->updateConnectionConfiguration($all_input, 'isConnectionStatusUpdated');

				break;

			case 'add_new_user' :
				$this->addUser($all_input);
				break;
			
			case 'connect_whatsapp' :

				$whatsapp_connection_id = $all_input['whatsapp_connection_id'];

				if($whatsapp_connection_id) {

					$this->updateWhatsappConnectionDetails($whatsapp_connection_id, $all_input);

				} else {

					$this->createWhatsappConnection($all_input);
				}
				break;
			
			case 'connect_google_reviews' :

				$google_reviews_connection_id = $all_input['google_reviews_connection_id'];

				if($google_reviews_connection_id) {

					$this->updateGoogleReviewsConnectionDetails($google_reviews_connection_id, $all_input);

				} else {

					$this->createGoogleReviewsConnection($all_input);
				}
				break;


			default:
				response()->json([
					'status' => false,
					'error'  => [
						'code'    => 100,
						'message' => 'Invalid data',
					],
				]);
				break;
		}
	}


	private function createOrganization($organization_details)
	{
		$organization_details['org_status'] = 'ACTIVE';
		$organization_details['user_id']    = Session::get('user', 'id');
		$organization_details['agencyId']   = Session::get('agency', 'id');


		$created_organization = $this->adminModel->saveOrganizationDetails($organization_details)['body'];

		if(getValue('status', $created_organization) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $created_organization['message'] ?? "Some problem form API",
				],
			]);

		} else {

			Session::set('organization', [
				'id' => $created_organization['data']['orgId'],
				'name' => $organization_details['company_name'],
			]);

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Organization created successfully",
						'extra'   => [
							'organization_id' => $created_organization['data']['orgId'],
						],
					],
			]);

		}
	}


	private function updateOrganizationDetails($organization_id, $organization_details)
	{

		if(!$organization_id) {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 10,
					'message' => 'No Organization to update details',
				],
			]);
		}

		$updated_created_organization = $this->adminModel->updateOrganizationDetails($organization_id, $organization_details)['body'];

		if(getValue('status', $updated_created_organization) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $updated_created_organization['message'] ?? "Some problem form API",
				],
			]);

		} else {

			//Update company name
			Session::set('organization', [
				'id' => $organization_id,
			]);

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Organization details updated successfully",
					],
			]);

		}

	}

	private function createWhatsappConnection($whatsapp_details)
	{
		$whatsapp_details['user_id']    = Session::get('user', 'id');
		$whatsapp_details['agencyId']   = Session::get('agency', 'id');
		$whatsapp_details['org_id'] = Session::get('organization', 'id');
		$whatsapp_details['status'] = 'ACTIVE';


		$add_whatsapp = $this->adminModel->saveWhatsappConnectionDetails($whatsapp_details)['body'];

		if(getValue('status', $add_whatsapp) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $add_whatsapp['message'] ?? "Some problem form API",
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Whatsapp connection created successfully",
						'extra'   => [ 'next_screen' => url('admin_connections') ],
					],
			]);

		}
	}

	private function updateWhatsappConnectionDetails($whatsapp_connection_id, $whatsapp_details)
	{

		if(!$whatsapp_connection_id) {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 10,
					'message' => 'No Whatsapp Connection to update details',
				],
			]);
		}

		$updated_created_organization = $this->adminModel->updateWhatsappConnectionDetails($whatsapp_connection_id, $whatsapp_details)['body'];

		if(getValue('status', $updated_created_organization) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $updated_created_organization['message'] ?? "Some problem form API",
				],
			]);

		} else {

			//Update company name
			Session::set('whatsapp_connection_id', [
				'id' => $whatsapp_connection_id,
			]);

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Whatsapp Connection details updated successfully",
					],
			]);

		}

	}

	private function createGoogleReviewsConnection($google_reviews_data)
	{
		$google_reviews_data['user_id']    = Session::get('user', 'id');
		$google_reviews_data['agencyId']   = Session::get('agency', 'id');
		$google_reviews_data['org_id'] = Session::get('organization', 'id');
		$google_reviews_data['status'] = 'ACTIVE';


		$add_whatsapp = $this->adminModel->saveGoogleReviewsConnectionDetails($google_reviews_data)['body'];

		if(getValue('status', $add_whatsapp) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $add_whatsapp['message'] ?? "Some problem form API",
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Google Reviews connection created successfully",
						'extra'   => [ 'next_screen' => url('admin_connections') ],
					],
			]);

		}
	}

	private function updateGoogleReviewsConnectionDetails($google_reviews_connection_id, $google_reviews_data)
	{

		if(!$google_reviews_connection_id) {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 10,
					'message' => 'No Whatsapp Connection to update details',
				],
			]);
		}

		$updated_created_organization = $this->adminModel->updateGoogleReviewsConnectionDetails($google_reviews_connection_id, $google_reviews_data)['body'];

		if(getValue('status', $updated_created_organization) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $updated_created_organization['message'] ?? "Some problem form API",
				],
			]);

		} else {

			//Update company name
			Session::set('google_reviews_connection_id', [
				'id' => $google_reviews_connection_id,
			]);

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Google Reviews Connection details updated successfully",
					],
			]);

		}

	}


	private function prepareBusinessDetails($business_details)
	{

		$business_details['competitor_1'] = str_replace('https://youtube.com/', '', $business_details['competitor_1']);
		$business_details['competitor_1'] = str_replace('www.youtube.com/', '', $business_details['competitor_1']);

		$business_details['competitor_2'] = str_replace('https://youtube.com/', '', $business_details['competitor_2']);
		$business_details['competitor_2'] = str_replace('www.youtube.com/', '', $business_details['competitor_2']);

		$business_details['competitor_1'] = 'https://youtube.com/'.$business_details['competitor_1'];
		$business_details['competitor_2'] = 'https://youtube.com/'.$business_details['competitor_2'];

		$hub_type             = $business_details['hub_type'];
		$dam_credentials_type = $business_details['dam_credentials_type'];

		$business_details['hub_type']        = "";
		$business_details['hub_url']         = "";
		$business_details['hub_credentials'] = "";

		if($hub_type) {

			$business_details['hub_type'] = $hub_type;

			if($hub_type != 'youtube') {
				$business_details['hub_url'] = $business_details['hub_url_'.$hub_type];
			} else {
				$youtube_credentials = json_decode(urldecode($business_details['hub_credentials_'.$hub_type] ?? ""), true);

				if($youtube_credentials) {

					// Get credentials By token
					$GoogleApiClient = new GoogleAPIClient();
					$user_tokens     = $GoogleApiClient->getTokensByAuthCode($youtube_credentials['userAccountAuthCode']);

					if(!isset($user_tokens['error'])) {

						unset($youtube_credentials['userAccountAuthCode']);
						$business_details['hub_credentials'] = json_encode(array_merge($user_tokens, $youtube_credentials));
						$business_details['hub_url'] =  $youtube_credentials['title'];
					}
				}			}
		}
		if($dam_credentials_type) {

			$dam_credentials_type_credentials = $business_details['dam_credentials_'.$dam_credentials_type];

			if($dam_credentials_type == 'google_drive' && $dam_credentials_type_credentials) {

				// Get credentials By token
				$GoogleApiClient = new GoogleAPIClient();
				$user_tokens     = $GoogleApiClient->getTokensByAuthCode($dam_credentials_type_credentials);

				if(!isset($user_tokens['error'])) {
					$business_details['assetName']        = $dam_credentials_type;
					$business_details['assetExpiry']      = getCustomUtcDate(strtotime("+1 hour", strtotime(date("Y-m-d H:i:s"))));
					$business_details['assetCredentials'] = json_encode($user_tokens);
				}

			}

		}

		return $business_details;

	}


	private function saveBusiness($business_details)
	{
		$business_details['org_id'] = Session::get('organization', 'id');

		$business_details = $this->prepareBusinessDetails($business_details);

		$created_business_info = $this->adminModel->saveBusinessDetails($business_details)['body'];

		if(getValue('status', $created_business_info) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $created_business_info['message'] ?? "Some problem form API",
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Business details saved successfully",
						'extra'   => [
							'business_id' => $created_business_info['data']['businessId'],
						],
					],
			]);

		}
	}

	public function googledrive()
	{
		$all_input = input()->all();	
		
		$organization_id = $all_input['orgId'] ?? null;

		if (!$organization_id) {
			return response()->json([
				'status' => false,
				'error' => [
					'code' => 10,
					'message' => 'Organization ID is required to disconnect Google Drive.',
				],
			]);
		}

		$response = $this->adminModel->disconnectDriveEndpoint(['orgId' => $organization_id]);


		if (isset($response['body']['status']) && $response['body']['status'] === 'success') {
			return response()->json([
				'status' => true,
				'message' => 'Google Drive disconnected successfully.',
			]);
		}

		return response()->json([
			'status' => false,
			'error' => [
				'code' => 20,
				'message' => $response['body']['message'] ?? 'Failed to disconnect Google Drive.',
			],
		]);
	}

	private function updateBusinessDetails($business_id, $business_details)
	{

		if(!$business_id) {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 10,
					'message' => 'No Business details to update details',
				],
			]);
		}

		$business_details = $this->prepareBusinessDetails($business_details);

		$updated_business_details = $this->adminModel->updateBusinessDetails($business_id, $business_details)['body'];

		if(getValue('status', $updated_business_details) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $updated_business_details['message'] ?? "Some problem form API",
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Business details updated successfully",
					],
			]);

		}

	}


	public function saveConnectionConfiguration($connection_type, $all_input, $return_connection_status_array = false)
	{
		$selected_config_info      = json_decode(urldecode($all_input[$connection_type] ?? ""), true);
		$connection_name           = $all_input['connection_name'];
		$connection_media_type     = $all_input['connection_media_type'];
		$organization_id           = Session::get('organization', 'id');
		$connection_config_data    = [];
		$connection_status_message = "";
	
		switch ($connection_type) {

			case 'facebook_page':
				$connection_config_data = [
					'name'              => $connection_name,
					'socialMediaType'   => $connection_media_type,
					'socialMediaHandle' => $selected_config_info['user_id'],
					'password'          => $selected_config_info['access_token'],
					'orgId'             => $organization_id,
					'tokenExpiry'       => getCustomUtcDate(strtotime("+3 months", strtotime(date("Y-m-d H:i:s")))),
					'status'            => 'Active',
					'isConfigured'      => true,
					'pageId'            => $selected_config_info['id'],
					'pageToken'         => $selected_config_info['access_token'],
					'description'       => $selected_config_info['category'],
				    'title' 			=> $selected_config_info['name']
				];
				break;

			case 'youtube_channel':

				$GoogleApiClient = new GoogleAPIClient();
				$user_tokens     = $GoogleApiClient->getTokensByAuthCode($selected_config_info['userAccountAuthCode']);

				if(!isset($user_tokens['error'])) {

					$user_details           = $GoogleApiClient->verifyUserCredentialsValidToken($user_tokens['id_token']);
					$connection_config_data = [
						'name'              => $connection_name,
						'socialMediaType'   => $connection_media_type,
						'socialMediaHandle' => $user_details['sub'] ?? "",
						'password'          => $user_tokens['access_token'],
						'orgId'             => $organization_id,
						'tokenExpiry'       => getCustomUtcDate(strtotime("+1 hour", strtotime(date("Y-m-d H:i:s")))),
						'status'            => 'Active',
						'isConfigured'      => true,
						'pageId'            => $selected_config_info['channel_id'],
						'pageToken'         => json_encode($user_tokens),
						'description'       => $selected_config_info['description'],
						'title'				=>$selected_config_info['title']
						
					];

				} else {

					$connection_status_message = "Could not get the channel details from ".$connection_name.", Please try again";
				}

				break;
				
				case 'instagram_account':

					$connection_config_data = [
						'name'              => $connection_name,
						'socialMediaType'   => $connection_media_type,
						'socialMediaHandle' => $selected_config_info['instagram_account_username'], //$selected_config_info['user_id'],
						'password'          => $selected_config_info['page_access_token'],
						'orgId'             => $organization_id,
						'tokenExpiry'       => getCustomUtcDate(strtotime("+3 months", strtotime(date("Y-m-d H:i:s")))),
						'status'            => 'Active',
						'isConfigured'      => true,
						'pageId'            => $selected_config_info['instagram_account_id'], //'page_id'
						'pageToken'         => $selected_config_info['page_access_token'],
						'description'       => "Instagram business account",
						'title'				=>$all_input['instagram_pagename']
					];
					break;
	
				case 'linkedin':
	
					$connection_config_data = [
						'name'              => $connection_name,
						'socialMediaType'   => $connection_media_type,
						'socialMediaHandle' => $selected_config_info['user_id'],
						'password'          => $selected_config_info['access_token'],
						'orgId'             => $organization_id,
						'tokenExpiry'       => getCustomUtcDate(strtotime("+2 months", strtotime(date("Y-m-d H:i:s")))),
						'status'            => 'Active',
						'isConfigured'      => true,
						'pageId'            => $selected_config_info['user_id'],
						'pageToken'         => $selected_config_info['access_token'],
						'description'       => "LinkedIn Account",
						'title' 			=>  $selected_config_info['username']
					];
					break;
					
				case 'E-Mail':

					$connection_config_data = [
						'name'              => $connection_name,
						'socialMediaType'   => $connection_media_type,
						'socialMediaHandle' => md5($connection_type),
						'password'          => $all_input['email_api_key'],
						'orgId'             => $organization_id,
						'tokenExpiry'       => getCustomUtcDate(strtotime("+3 months", strtotime(date("Y-m-d H:i:s")))),
						'status'            => 'Active',
						'isConfigured'      => true,
						'pageId'            => sha1($connection_name),
						'pageToken'         => json_encode([
							'from_email' => $all_input['email_from_address'],
							'api_key'    => $all_input['email_api_key'],
						]),
						'description'       => "E-Mail Provider details",
					];
					break;

			default:
				$connection_config_data = [
					'name'              => $connection_name,
					'socialMediaType'   => $connection_media_type,
					'socialMediaHandle' => md5($connection_type),
					'password'          => sha1($connection_name),
					'orgId'             => $organization_id,
					'tokenExpiry'       => getCustomUtcDate(strtotime("+3 months", strtotime(date("Y-m-d H:i:s")))),
					'status'            => 'Active',
					'isConfigured'      => true,
					'pageId'            => sha1($connection_name),
					'pageToken'         => sha1($connection_media_type.$connection_name),
					'description'       => "Info about channel",
				];
				break;

		}

		$connection_status = [];


		if($connection_config_data) {

			$saved_connection_configuration = $this->adminModel->saveConnectionConfiguration($connection_config_data)['body'];

			if(getValue('status', $saved_connection_configuration) != 'success') {

				$connection_status = [
					'status' => false,
					'error'  => [
						'code'    => 20,
						'message' => $saved_connection_configuration['message'] ?? "Some problem from API",
						'extra'   => [
							'isConfigured' => false,
						],
					],
				];

			} else {

				$connection_status = [
					'status' => true,
					'data'   =>
						[
							//'message' => "Connection Configured successfully",
							'extra' => [
								'isConfigured' => true,
							],
						],
				];
			}

		} else {

			$connection_status = [
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $connection_status_message ?? "Connection not supported currently",
					'extra'   => [
						'isConfigured' => false,
					],
				],
			];

		}


		if(!$return_connection_status_array) {

			response()->json($connection_status);

		} else {

			return $connection_status;
		}

	}


	private function updateConnectionConfiguration($all_input, $status_key)
	{

		$connection_name                     = $all_input['connection_name'];
		$connection_new_configuration_status = (bool)$all_input['connection_new_configuration_status'];
		$connection_new_status               = $all_input['connection_new_status'];
		$organization_id                     = Session::get('organization', 'id');
		$connection_config_data              = [
			'name'         => $connection_name,
			'orgId'        => $organization_id,
			'isConfigured' => $connection_new_configuration_status,
			'status'       => $connection_new_status,
		];
		$updated_connection_configuration    = $this->adminModel->updateConnectionConfiguration($connection_config_data)['body'];

		if(getValue('status', $updated_connection_configuration) != 'success') {


			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $updated_connection_configuration['message'] ?? "Some problem form API",
					'extra'   => [
						$status_key => false,
					],
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "Connection has been updated",
						'extra'   => [
							$status_key => true,
						],
					],
			]);
		}

	}


	private function addUser($user_details)
	{
		$organization_id = Session::get('organization', 'id');
		$agencyId = Session::get('agency', 'id');
		if(!$organization_id) {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 10,
					'message' => `${$organization_id} ${$agencyId}`,
				],
			]);
		}

		// Ensure user_name is not null
		if (empty($user_details['user_name']) || $user_details['user_name'] === 'null') {
			return response()->json([
				'status' => false,
				'error'  => [
					'code'    => 15,
					'message' => "Please select a valid user",
				],
			]);
		}

		// Ensure user_role is not null
		if (empty($user_details['user_role']) || $user_details['user_role'] === 'null') {
			return response()->json([
				'status' => false,
				'error'  => [
					'code'    => 16,
					'message' => "Please select a valid role",
				],
			]);
		}

		
		$user_details['org_id'] = $organization_id;
		$user_details['agency_id'] = $agencyId;

		$created_user = $this->adminModel->createUser($user_details)['body'];

		if(getValue('status', $created_user) != 'success') {

			response()->json([
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => $created_user['message'] ?? "Some problem form API",
				],
			]);

		} else {

			response()->json([
				'status' => true,
				'data'   =>
					[
						'message' => "User created successfully",
						'extra'   => [
							'next_screen' => url('admin_team_list'),
						],
					],
			]);

		}
	}


	/**
	 * @param $organization_id
	 *
	 * @return array|mixed
	 */
	public function getBusinessDetails($organization_id)
	{
		$business_details = $this->adminModel->getBusinessDetails($organization_id)['body'];

		if(getValue('status', $business_details) == 'success') {

			$business_details = $business_details['data'];

			$business_details['type'] = $business_details['type'] ?? "";
			$business_details['url']  = $business_details['url'] ?? "";

			$business_details['competitor1'] = str_replace('https://youtube.com/', '', $business_details['competitor1']);
			$business_details['competitor1'] = str_replace('www.youtube.com/', '', $business_details['competitor1']);
			$business_details['competitor2'] = str_replace('https://youtube.com/', '', $business_details['competitor2']);
			$business_details['competitor2'] = str_replace('www.youtube.com/', '', $business_details['competitor2']);

			$business_details['type'] = str_replace("-", "_", strtolower($business_details['type']));
			$business_details['page_description_tags']  = $business_details['descriptionTags'] ?? "";
			
			$business_details['hub_url_'.$business_details['type']] = $business_details['url'];
			if($business_details['assetAssetId'] && $business_details['assetName'] && $business_details['assetCredentials']) {

				$business_details['assetCredentials'] = json_decode($business_details['assetCredentials'], true);
			}

		} else {
			$business_details = [];
		}

		return $business_details;
	}
}
