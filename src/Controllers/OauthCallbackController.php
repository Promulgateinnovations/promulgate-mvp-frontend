<?php

namespace Promulgate\Controllers;

use Josantonius\Session\Session;

/**
 * Class OauthCallbackController
 *
 * @package Promulgate\Controllers
 */
class OauthCallbackController extends BaseController
{

	/**
	 * CampaignController constructor.
	 *
	 * @param array  $params
	 */
	public function __construct(array $params = [])
	{
		parent::__construct($params);

	}


	protected function setWebContext()
	{
		// TODO: Implement setWebContext() method.
	}


	public function processAjax()
	{

	}


	public function processLinkedIn()
	{
		$redirect_url = url('admin_connections'); // TODO: Use $linkedin_response['source'] redirect based on source to destination URL

		$linkedin_response = input()->all();

		$connection_status = [];

		if(!$linkedin_response['source'] || (Session::pull('linkedin_oauth_state') != $linkedin_response['state'] || !$linkedin_response['code'])) {

			$connection_status = [
				'status' => false,
				'error'  => [
					'code'    => 20,
					'message' => "Something went wrong with Linked In Connection, please try again!",
					'extra'   => [
						'isConfigured' => false,
					],
				],
			];

		} else {

			$LinkedInClient = new \LinkedIn\Client(env('LINKEDIN_CLIENT_ID'), env('LINKEDIN_CLIENT_SECRET'));
			$LinkedInClient->setRedirectUrl(getAbsoluteUrl('oauth_linkedin_callback', NULL, [
				'source' => 'connection',
			]));

			try {

				$access_token        = $LinkedInClient->getAccessToken($linkedin_response['code']);
				$profile_information = $LinkedInClient->api('/v2/me');

				if($profile_information['id'] && $access_token->getToken()) {

					$connection_info = [
						'connection_name'       => 'LinkedIn',
						'connection_media_type' => 'ORGANIC',
						'linkedin'              => urlencode(json_encode([
							'user_id'      => $profile_information['id'],
							'username'     => $profile_information['localizedFirstName'],
							'access_token' => $access_token->getToken(),
						])),
					];

					$AdminController   = new AdminController();
					$connection_status = $AdminController->saveConnectionConfiguration('linkedin', $connection_info, true);

				} else {

					$connection_status = [
						'status' => false,
						'error'  => [
							'code'    => 20,
							'message' => "Something went wrong with Linked In Connection, please try again!",
							'extra'   => [
								'isConfigured' => false,
							],
						],
					];

				}

			}
			catch (\LinkedIn\Exception $e) {

				$connection_status = [
					'status' => false,
					'error'  => [
						'code'    => 20,
						'message' => "Something went wrong with Linked In Connection, please try again!",
						'extra'   => [
							'isConfigured' => false,
						],
					],
				];
			}
		}

		$connection_status['provider_connection_name'] = 'LinkedIn';

		Session::set('CONNECTION_OAUTH_STATUS', $connection_status);

		// Redirect back to connections screen & show error or success message
		redirect($redirect_url);

	}

}