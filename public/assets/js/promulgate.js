$(document).ready(function () {

  var checkBusinessHubType = $("input[type=radio][name=hub_type]:checked").val();
  if (checkBusinessHubType && checkBusinessHubType === 'youtube') {
    $('.competitor_main_section').removeClass('d-none');
  }
  
  var isOnline = true;
  setInterval(function () {
    if (isOnline !== navigator.onLine) {
      isOnline = navigator.onLine;

      if (isOnline) {
        showSuccessMessageToast("Your are connected to internet", "Online", {
          positionClass: "toast-top-right",
        });
      } else {
        showErrorMessageToast("Your are not connected to internet", "Offline", {
          positionClass: "toast-top-right",
        });
      }
    }
  }, 30000);

  $('[data-toggle="tooltip"]').tooltip();

  $(".button_source").click(function () {
    $("#button_source").val($(this).attr("data-b-source"));
  });

  $(".link-in-iframe").click(function (event) {
    event.preventDefault();
    $.fancybox.open({
      src: $(this).attr("href"),
      type: "iframe",
      closeExisting: true,
      backFocus: true,
      opts: {
        keyboard: true,
        buttons: ["close"],
        protect: true,
      },
    });
  });

  enableBootstrapValidator();

  $(".js-select-2").select2({
    placeholder: {
      id: "0",
      text: "Select....",
    },
    minimumResultsForSearch: 10,
    allowClear: true,
  });
  //.change(function (e) {
  //     //$('#select2Form').bootstrapValidator('revalidateField',
  // 'colors'); console.log("SELECTION CHANGED", e); })

  $(".data-table-emply").DataTable({
    pageLength: 10,
    lengthMenu: [10, 20, 50, 100],
    paging: true,
    searching: true,
    ordering: true,
    select: false,
    columnDefs: [
      { targets: [4, 5], orderable: false }
    ]
  });
  
  $(".data-table").DataTable({
    pageLength: 10,
    lengthMenu: [10, 20, 50, 100],
    paging: true,
    searching: true,
    ordering: true,
    select: false,
    columnDefs: [
      { targets: [2, 3], orderable: false }
    ]
  });
  
  var campaigns_list_table = $(".data-table-campaigns-list").DataTable({
    pageLength: 10,
    lengthMenu: [10, 20, 50, 100],
    paging: true,
    searching: true,
    select: true,
    ordering: true,
    order: [[4, "desc"]],
    sDom: "", // "sDom":"lftipr"
    //"dom": '<"campaign_status_filter">'
    columnDefs: [
      { targets: [5], orderable: false } // Assuming "User Status" is column index 5
    ],
  });

  //$("div.data_table_status_filter").html('<select
  // class="s"><option>Test</option><option>test 2</option></select>');

  $("#campaign_status_filter").on("change", function () {
    campaigns_list_table.columns(1).search(this.value).draw();
  });

  $(".date-time-picker-min-time").datetimepicker({
    timepicker: true,
    // format: 'd/m/Y H:i',
    minDate: 0, //yesterday is minimum date(for today use 0 or -1970/01/01)
    onChangeDateTime: function (dp, $input) {
      $(
        $("#" + $input.attr("id"))
          .parent()
          .closest("form")
      ).bootstrapValidator("revalidateField", $input.attr("name"));
    },
  });

  $("#campaign_topic").blur(function () {
    $("#pre-campaign-analysis-link").attr(
      "href",
      "https://www.social-searcher.com/social-buzz/?q5=" + $(this).val()
    );
  });

  // $('#campaign_video_url').blur(function () {
  //     $('#view_campaign_video_url').attr('href', $(this).val());
  // });

  $(".age_range_slider").slider({
    id: "age_range",
    min: 10,
    max: 100,
    range: true,
    formatter: function (value) {
      return "Age group: " + value;
    },
  });

  $(".sidemenu .toggle-icon").click(function () {
    $(this).find("i").toggleClass("fa-chevron-right");
    $(".main_body").toggleClass("short_side_menu_main_body");
  });

  $(".add_new_post_at").on("click", function () {
    var channel = $(this).attr("data-channel-source");
    if (channel) {
      channel = "#curation_channel_" + channel;
      var added_field = $(channel + " .main_post_at")
        .clone()
        .val("")
        .attr("class", "form-control post_at date-time-picker-min-time")
        .appendTo(channel + " .post_at_group")
        .datetimepicker({
          timepicker: true,
          // format: 'd/m/Y H:i',
          minDate: 0, //yesterday is minimum date(for today use 0 or
          // -1970/01/01)
        });

      $(channel).bootstrapValidator("addField", added_field);
    }
  });

  $(".add-campaign-url-to-comment").on("click", function () {
    var channel = $(this).attr("data-channel-source");
    if (channel) {
      var commentField = "#curation_channel_" + channel + " #campaign_comment";
      $(commentField).val(
        $(commentField).val() + $("#comment_campaign_video_url").val()
      );
    }
    $(this).prop("disabled", true);
  });

  $("input[type=radio][name=hub_type]").change(function () {
    $(".hub_type_fields .hub_connection_type_fields").addClass("d-none");
    $(".hub_type_fields .hub_connection_type_" + $(this).val()).removeClass(
      "d-none"
    );
  });

  $("input[type=checkbox][name=use_dam]").change(function () {
    $(".dam_management_tools").toggleClass("d-none", "d-block");
  });

  $(".add_youtube_link").click(function () {
    var channel = $(this).attr("data-channel-source");
    var videoUrl = $(this).attr("data-video-url");

    if (channel && videoUrl) {
      channel = "#curation_channel_" + channel;
      var current_value = $(channel + " #campaign_comment").val();
      $(channel + " #campaign_comment").val(
        current_value + " " + videoUrl + " "
      );
    }
  });

  $(".channel_data_preview").click(function () {
    var channel = $(this).attr("data-channel-source");
    if (channel) {
      var channelForm = "#curation_channel_" + channel;
      var previewData = getFormData($(channelForm));

      var campaignPostAt = getCampaignPostAtDatesList(
        previewData["when_to_post[]"] || ""
      );

      var previewContent =
        '<div class="channel_data_preview">' +
        '<div class="row">' +
        '<div class="form-group">' +
        '<div class="title">Image/Video URL</div>' +
        '<div class="content"><p>' +
        (previewData.file_url || "-") +
        "</p></div>" +
        "</div>";

      if (previewData.campaign_to != undefined) {
        previewContent +=
          '<div class="form-group">' +
          '<div class="title">To</div>' +
          '<div class="content"><p>' +
          (previewData.campaign_to || "-") +
          "</p></div>" +
          "</div>";
      }
      if (previewData.campaign_subject != undefined) {
        previewContent +=
          '<div class="form-group">' +
          '<div class="title">Subject</div>' +
          '<div class="content"><p>' +
          (previewData.campaign_subject || "-") +
          "</p></div>" +
          "</div>";
      }

      previewContent +=
        '<div class="form-group">' +
        '<div class="title">Comment</div>' +
        '<div class="content"><p>' +
        (previewData.campaign_comment || "-") +
        "</p></div>" +
        "</div>" +
        '<div class="form-group">' +
        '<div class="title">Campaign will be posted at following time(s)</div>' +
        '<div class="content">' +
        campaignPostAt +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      var channelIcon = $(channelForm + " .social_icon_block").html() || "";

      Swal.fire({
        //title: '<span>' + capitalize(channel) + '</span> ',
        // icon: 'info',
        iconHtml: channelIcon + "<small>" + capitalize(channel) + "</small>",
        html: previewContent,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        buttonsStyling: true,
        reverseButtons: false,
        confirmButtonText: "Looks fine",
        focusConfirm: true,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
      });
    }
  });

  $(".wa_template_preview").click(function () {
    var channel = $(this).attr("data-channel-source");
    if (channel) {
      var channelForm = "#curation_channel_" + channel;
      var previewData = getFormData($(channelForm));
      var selectedTemplate = $("#wa_template")
        .find(":selected")
        .data("component");
      var selectedTemplateStatus = $("#wa_template")
        .find(":selected")
        .data("status");
      var campaignPostAt = getCampaignPostAtDatesList(
        previewData["when_to_post[]"] || ""
      );
      var previewContent = "";
      if (selectedTemplate != undefined) {
        //previewContent += '<div>';
        if (selectedTemplateStatus != "APPROVED") {
          previewContent +=
            '<p class="warning_note">Note: Only APPROVED templates can  be broadcasted. </p>';
        }
        previewContent += '<div class="wa_preview">';
        for (let t in selectedTemplate) {
          if (selectedTemplate[t].type == "HEADER") {
            if (selectedTemplate[t].format == "TEXT") {
              previewContent +=
                '<h2 class="wa_preview_header">' +
                selectedTemplate[t].text +
                "</h2>";
            } else if (selectedTemplate[t].format == "IMAGE") {
              previewContent +=
                '<img class="wa_preview_header_img" src="' +
                selectedTemplate[t].example.header_handle[0] +
                '" />';
            }
          } else if (selectedTemplate[t].type == "BODY") {
            previewContent +=
              '<p class="wa_preview_body">' + selectedTemplate[t].text + "</p>";
          } else if (selectedTemplate[t].type == "FOOTER") {
            previewContent +=
              '<h3 class="wa_preview_footer">' +
              selectedTemplate[t].text +
              "</h3>";
          } else if (selectedTemplate[t].type == "BUTTONS") {
            previewContent += '<div class="wa_button_section">';
            for (let b in selectedTemplate[t].buttons) {
              if (selectedTemplate[t].buttons[b].type == "QUICK_REPLY") {
                previewContent +=
                  '<button class="btn btn-promulgate-primary w-100 mb-2">' +
                  selectedTemplate[t].buttons[b].text +
                  "</button>";
              } else {
                previewContent +=
                  '<a class="mb-2" href="#"> <i class="fa fa-link"></i> ' +
                  " Link" +
                  "</a>";
              }
            }
            previewContent += "</div>";
          }
        }
        previewContent += "</div>";
        if (campaignPostAt != "") {
          previewContent +=
            '<div class="form-group">' +
            '<div class="wa_posting_title">Campaign will be posted at following time(s)</div>' +
            '<div class="wa_posting_content mb-2">' +
            campaignPostAt +
            "</div>" +
            "</div>";
        }
      } else {
        previewContent =
          '<h3 class="text-center mt-3">Template not selected</h3>';
      }

      var channelIcon = $(channelForm + " .social_icon_block").html() || "";

      Swal.fire({
        //title: '<span>' + capitalize(channel) + '</span> ',
        // icon: 'info',
        iconHtml: channelIcon + "<small>" + capitalize(channel) + "</small>",
        html: previewContent,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        buttonsStyling: true,
        reverseButtons: false,
        confirmButtonText: "Looks fine",
        focusConfirm: true,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
      });
    }
  });

  $("#wa_template").change(function () {
    var selectedTemplate = $("#wa_template")
      .find(":selected")
      .data("component");

    if (selectedTemplate) {
      if (selectedTemplate[0].format == "IMAGE") {
        $(".display_img_picker_for_template").removeClass("d-none");
      } else {
        $(".display_img_picker_for_template").addClass("d-none");
      }
    } else {
      $(".display_img_picker_for_template").addClass("d-none");
    }

    $("#wa_template_lang").val(
      $("#wa_template").find(":selected").data("lang")
    );
  });

  $(".wa_add_template_preview").click(function () {
    var channel = $(this).attr("data-channel-source");
    if (channel) {
      var channelForm = "#curation_channel_" + channel;
      var previewData = getFormData($(channelForm));
      var previewContent = "";
      previewContent += '<div class="wa_preview">';
      if (previewData.file_url != "") {
        previewContent +=
          '<img class="wa_preview_header_img mb-2" src="' +
          previewData.file_url +
          '" />';
      }

      if (previewData.campaign_comment != "") {
        previewContent +=
          '<p class="wa_preview_body">' + previewData.campaign_comment + "</p>";
      }

      if (previewData.cta != "") {
        previewContent +=
          '<a class="wa_preview_link" href="' +
          previewData.cta +
          '"><i class="fa fa-link"></i> Link</a>';
      }
      previewContent += "</div>";

      var channelIcon = $(channelForm + " .social_icon_block").html() || "";

      Swal.fire({
        //title: '<span>' + capitalize(channel) + '</span> ',
        // icon: 'info',
        iconHtml: channelIcon + "<small>" + capitalize(channel) + "</small>",
        html: previewContent,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        buttonsStyling: true,
        reverseButtons: false,
        confirmButtonText: "Looks fine",
        focusConfirm: true,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
      });
    }
  });

  $("#share_with_captive_members").change(function () {
    changeTargetViewers(this.checked);
  });

  $(".organization_connection_configuration").change(function () {
    const connection_selector = "#" + $(this).attr("data-connection_setting_id");
    const connection_name = $(this).attr("data-connection_setting_name");
    const isConnected = $(this).prop("checked");
    const orgId = $("#dam_organization_id").val();

    //If config connection is enabled then enable active checkbox
    if (isConnected) {
      Swal.fire({
        position: "top",
        title: "Connect your account",
        text: "Link your " + connection_name + " account in next screen",
        iconHtml: '<i class="fa fa-chain"></i>',
        iconColor: "#1998bf",
        showCancelButton: true,
        confirmButtonColor: "#1998bf",
        cancelButtonColor: "#d33",
        confirmButtonText: "Link " + connection_name,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
        showLoaderOnConfirm: false,
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          if (connection_selector == "#connection_whatsapp") {
            window.open("/admin/connect-whatsapp", "_blank").focus();
            return false;
          } else if (connection_selector == "#connection_google_reviews") {
            window.open("/admin/connect-google-reviews", "_blank").focus();
            return false;
          }

          var isCustomConnection = parseInt(
            $(this).attr("data-api_connection")
          );
          var oauthAuthorizationUrlConstant = $(this).attr(
            "data-oauth_authorization_url_constant"
          );

          if (eval(oauthAuthorizationUrlConstant)) {
            location.href = eval(oauthAuthorizationUrlConstant);
          } else {
            if (isCustomConnection) {
              handleConfigurationConnections($(this));
            } else {
              handleConfigurationConnections($(this), true);
            }
          }
        } else {
          disableConfigurationAndDisableActiveConnection(
            $(this),
            connection_selector
          );
          if (isBusinessPage) {
            enableActiveConnection(connection_selector);
          }
        }
      });
    } else if (isConnected===false && connection_name === "Google Drive") {
      Swal.fire({
          title: "Disconnect your account",
          text: "Are you sure you want to disconnect your " + connection_name + " account?",
          iconHtml: '<i class="fa fa-chain-broken"></i>',
          iconColor: "#1998bf",
          showCancelButton: true,
          confirmButtonColor: "#1998bf",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, disconnect",
      }).then((result) => {
          if (result.isConfirmed) {
            // Disconnect API call via AJAX
              const requestBody = {
                ajax_source: "admin/ajax",
                from_ajax: true,
                form_source: "googledrive",
                orgId: orgId,
              };

              $.ajax({
                  url: "/admin/ajax",
                  type: "POST",
                  dataType: "json",
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.stringify(requestBody),
                  success: function (response) {
                      if (response.status) {
                          Swal.fire({
                              title: "Disconnected!",
                              text: "Your account has been disconnected.",
                              icon: "success",
                              timer: 2000,
                          });
                          window.location.reload();
                          $(connection_selector).prop("checked", false);
                      } 
                      else {
                          Swal.fire({
                              title: "Error",
                              text: "Failed to disconnect. Please try again.",
                              icon: "error",
                          });
                      }
                  },
                  error: function () {
                      Swal.fire({
                          title: "Error",
                          text: "An error occurred while disconnecting.",
                          icon: "error",
                      });
                  },
              });
          } else {
            disableConfigurationAndDisableActiveConnection(
                $(this),
                connection_selector,
                "You are still connected with Google Drive"
            );
        }
      });
  } else {
      changeConnectionConfigurationStatusAndActiveSelectorStatus(
        "update_connection_configuration",
        connection_name,
        false,
        "InActive",
        $(this),
        connection_selector
      );
    }
  });

  $(".organization_connection_active_toggle").change(function () {
    var connection_name = $(this).attr("data-connection_setting_name");

    //If config connection is enabled then enable active checkbox
    if ($(this).prop("checked")) {
      changeConnectionConfigurationStatusAndActiveSelectorStatus(
        "update_connection_status",
        connection_name,
        true,
        "Active",
        "",
        "#" + $(this).attr("id")
      );
    } else {
      changeConnectionConfigurationStatusAndActiveSelectorStatus(
        "update_connection_status",
        connection_name,
        true,
        "InActive",
        "",
        "#" + $(this).attr("id")
      );
    }
  });
});

const platformContent = {
  Facebook: `
    <div class="small-text">
      <h4>Connect Your Facebook Account</h4>
      <p><strong>Description:</strong><br>
        Before proceeding, ensure the following:</p>
      <ol>
        <li>Your Facebook account is not a <strong>business account</strong>.</li>
        <li>You'll need to create or select a <strong>Facebook Page</strong> during the connection process.</li>
      </ol>
      <p><strong>Instructions for Connecting:</strong></p>
      <ol>
        <li>Click the <strong>"Connect to Facebook"</strong> button below.</li>
        <li>Log in to your personal Facebook account (if not already logged in).</li>
        <li>Authorize Promulgate to manage your Facebook Page.</li>
        <li>Select an existing Facebook Page or create a new one.</li>
      </ol>
      <p>If you want detailed documentation with images, click the <strong>Download Guide</strong>&nbsp;button.</p>
    </div>
  `,
  Instagram: `
    <div class="small-text">
      <h4>Connect Your Instagram Account</h4>
      <p><strong>Description:</strong><br>
        Ensure you have a professional or creator Instagram account linked to a Facebook Page.</p>
      <p><strong>Instructions for Connecting:</strong></p>
      <ol>
        <li>Click the <strong>"Connect to Instagram"</strong> button below.</li>
        <li>Log in to your Instagram account (if not already logged in).</li>
        <li>Link your Instagram account to a Facebook Page for seamless post management.</li>
      </ol>
      <p>If you want detailed documentation with images, click the <strong>Download Guide</strong>&nbsp;button.</p>
    </div>
  `,
  Linkedin: `
    <div class="small-text">
      <h4>Connect Your LinkedIn Account</h4>
      <p><strong>Description:</strong><br>
        Ensure you have admin access to your LinkedIn company page or profile.</p>
      <p><strong>Instructions for Connecting:</strong></p>
      <ol>
        <li>Click the <strong>"Connect to LinkedIn"</strong> button below.</li>
        <li>Log in to your LinkedIn account (if not already logged in).</li>
        <li>Authorize Promulgate to manage your LinkedIn posts.</li>
        <li>Select your LinkedIn profile or company page to manage posts.</li>
      </ol>
      <p>If you want detailed documentation with images, click the <strong>Download Guide</strong>&nbsp;button.</p>
    </div>
  `,
  Youtube: `
    <div class="small-text">
      <h4>Connect Your YouTube Channel</h4>
      <p><strong>Description:</strong><br>
        Ensure your YouTube channel is verified for the best performance.</p>
      <p><strong>Instructions for Connecting:</strong></p>
      <ol>
        <li>Click the <strong>"Connect to YouTube"</strong> button below.</li>
        <li>Log in to your Google account (if not already logged in).</li>
        <li>Authorize Promulgate to manage your YouTube channel.</li>
        <li>Select your YouTube channel to manage video posts.</li>
      </ol>
      <p>If you want detailed documentation with images, click the <strong>Download Guide</strong>&nbsp;button.</p>
    </div>
  `,
  Whatsapp: `
    <div class="small-text">
      <h4>Connect Your WhatsApp Account</h4>
      <p><strong>Description:</strong><br>
        Make sure you have WhatsApp Business set up for this integration.</p>
      <p><strong>Instructions for Connecting:</strong></p>
      <ol>
        <li>Click the <strong>"Connect to WhatsApp"</strong> button below.</li>
        <li>Log in to your WhatsApp Business account (if not already logged in).</li>
        <li>Authorize Promulgate to manage your WhatsApp communications.</li>
        <li>Select your WhatsApp Business number for integration.</li>
      </ol>
      <p>If you want detailed documentation with images, click the <strong>Download Guide</strong>&nbsp;button.</p>
    </div>
  `
};

// Function to show the popup
function showPopup(platformName) {
  // Normalize platform name to handle inconsistencies
  const normalizedPlatformName = platformName.trim().toLowerCase();
  const formattedPlatformName =
    normalizedPlatformName.charAt(0).toUpperCase() + normalizedPlatformName.slice(1);

  // Retrieve content for the specified platform
  const content = platformContent[formattedPlatformName];

  // Define file paths for downloading guides
  const pdfFilePaths = {
    Facebook: '/assets/fb.pdf',
    Instagram: '/assets/insta.pdf',
    Linkedin: '/assets/Linkedin.pdf',
    Youtube: '/assets/Youtube.pdf',
    Whatsapp: '/assets/whatsapp.pdf' // Ensure this path is correct
  };

  const pdfFilePath = pdfFilePaths[formattedPlatformName];

  // Handle missing content or incorrect platform name
  if (!content || !pdfFilePath) {
    Swal.fire({
      title: 'Error',
      text: `Platform guide for ${formattedPlatformName} not found. Please check the platform name.`,
      icon: 'error',
      confirmButtonText: 'Close'
    });
    console.error(`Invalid platform name: ${platformName}`);
    return;
  }

  // Show the popup with the appropriate content
  Swal.fire({
    position: 'top',
    title: `${formattedPlatformName} Connection Guide`,
    html: ` 
      <div style="text-align: left;">
        ${content}
        <button id="downloadBtn" class="btn btn-primary mt-3">
          <i class="fa fa-download" style="color: white;"></i>&nbsp;Download Guide
        </button>
      </div>
    `,
    iconHtml: '<i class="fa fa-info-circle"></i>',
    iconColor: '#1998bf',
    showCancelButton: false,
    confirmButtonColor: '#1998bf',
    confirmButtonText: 'Close',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut'
    }
  });

  // Add functionality to download the guide
  $('#downloadBtn').click(function () {
    // Ensure the PDF exists at the correct path
    const link = document.createElement('a');
    link.href = pdfFilePath; // Path to the local PDF
    link.download = `${formattedPlatformName}_Connection_Guide.pdf`; // Set the file name for the download
    link.click();
  });
}

function changeConnectionConfigurationStatusAndActiveSelectorStatus(
  form_source,
  connection_name,
  config_status,
  status,
  connection_configuration_toggle_element,
  connection_selector
) {
  showProcessingToast();

  var inputData = {
    ajax_source: ADMINS_AJAX_SOURCE,
    from_ajax: true,
    form_source: form_source,
    connection_configuration_toggle_element:
      connection_configuration_toggle_element
        ? "#" + connection_configuration_toggle_element.attr("id")
        : "",
    connection_selector: connection_selector,
    connection_name: connection_name,
    connection_new_configuration_status: config_status,
    connection_new_status: status,
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      //console.log(error);
    },
  });
}

function enableBootstrapValidator() {
  $.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend(
    {},
    $.fn.bootstrapValidator.DEFAULT_OPTIONS,
    {
      excluded: ":disabled",
      live: "enabled",
      onError: function (e) {
        toastr.clear();
      },
      onSuccess: function (e) {
        showProcessingToast();

        e.preventDefault();
        $(".form-status").remove();
        processData(e.target);
      },
      fields: {
        // ✅ Agency Name Validation
        agency_name: {
          validators: {
            notEmpty: {
              message: "Please provide agency name",
            },
            callback: {
              message: "Invalid input",
              callback: function (value, validator, $field) {
                value = value.trim();

                if ((value.length < 5 || value.length > 32 )&&value.length !="") {
                  return {
                    valid: false,
                    message: "Agency name must be between 5 and 32 characters long",
                  };
                }

                if (!/^[a-zA-Z\s]+$/.test(value)&&value.length !="") {
                  return {
                    valid: false,
                    message: "Agency name can only contain alphabets and spaces",
                  };
                }

                return true;
              },
            },
          },
        },

        email: {
          validators: {
            notEmpty: {
              message: "Please provide email",
            },
            callback: {
              message: "Invalid input",
              callback: function (value, validator, $field) {
                value = value.trim();
                if (value.length > 30) {
                  return {
                    valid: false,
                    message: "Email address cannot be longer than 30 characters.",
                  };
                }
                if (!value.includes('@') && value.length > 25) {
                  return {
                    valid: false,
                    message: "Please provide a valid email address",
                  };
                }
                if (/[A-Z]/.test(value)) {
                  return {
                    valid: false,
                    message: "Email cannot contain uppercase letters.",
                  };
                }
                return true;
              },
            },
          },
        },

        // ✅ Agency Description Validation 
        agency_description: {
          validators: {
            notEmpty: {
              message: "Please provide a agency description",
            },
            callback: {
              message: "Invalid input",
              callback: function (value, validator, $field) {
                value = value.trim();
        
                if ((value.length < 10 || value.length > 250) && value.length != "") {
                  return {
                    valid: false,
                    message: "Description must be between 10 and 250 characters long",
                  };
                }
        
                if (!/^[a-zA-Z#@\$*&()/\\!‘’“”._\s]+$/.test(value) && value.length != "") {
                  return {
                    valid: false,
                    message: "Description can only contain letters and specific special characters",
                  };
                }
        
                return true;
              },
            },
          },
        },
        email_from_address: {
          validators: {
            notEmpty: {
              message: "Please provide from email",
            },
          },
        },
        email_api_key: {
          validators: {
            notEmpty: {
              message: "Please provide from email",
            },
          },
        },
        password: {
          validators: {
            notEmpty: {
              message: "Please provide password",
            },
            stringLength: {
              min: 5,
              max: 20,
              message: "The password must be between 5 and 20 characters long",
            },
          },
        },
        first_name: {
          validators: {
            notEmpty: {
              message: "Please provide first name",
            },
            stringLength: {
              min: 3,
              max: 20,
              message: "First name must be between 3 and 20 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z ]+$/,
              message: "First name can only consist of alphabets & spaces",
            },
          },
        },
        last_name: {
          validators: {
            notEmpty: {
              message: "Please provide last name",
            },
            stringLength: {
              min: 1,
              max: 20,
              message: "Last name must be between 1 and 20 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z ]+$/,
              message: "First name can only consist of alphabets & spaces",
            },
          },
        },
        username: {
          validators: {
            notEmpty: {
              message: "Please provide username",
            },
            stringLength: {
              min: 3,
              max: 20,
              message: "Username must be between 3 and 20 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9]+$/,
              message: "Username can only consist of alphabets & numbers",
            },
          },
        },
        user_role: {
          validators: {
            choice: {
              min: 1,
              message: "Please select user role",
            },
          },
        },
        company_name: {
          validators: {
            notEmpty: {
              message: "Please provide company name",
            },
            stringLength: {
              min: 5,
              max: 50,
              message:
                "The company name must be more than 6 and less than 30 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9 ]+$/,
              message:
                "The company name can only consist of alphabets, numbers & spaces",
            },
          },
        },
        company_alias: {
          validators: {
            notEmpty: {
              message: "Please provide company alias",
            },
            stringLength: {
              min: 5,
              max: 50,
              message:
                "The company alias must be more than 6 and less than 30 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9 ]+$/,
              message:
                "The company alias can only consist of alphabets, numbers & spaces",
            },
          },
        },
        company_url: {
          validators: {
            notEmpty: {
              message: "The Campaign Video Url is required",
            },
            callback: {
              //message: 'Please provide Campaign Video URL',
              callback: function (value, validator, $field) {
                if (value && !isUrlValid(value)) {
                  return {
                    valid: false,
                    message: "Please provide valid Campaign Video URL",
                  };
                }

                return true;
              },
            },
          },
        },
        last_modified: {
          validators: {
            notEmpty: {
              message: "The last modified date is required",
            },
          },
        },
        social_media_policy: {
          validators: {
            notEmpty: {
              message: "Please provide policy terms",
            },
            stringLength: {
              min: 20,
              max: 2000,
              message:
                "The policy terms must be more than 20 characters long & less than 2000",
            },
          },
        },
        // 'organization_connection_config[]': {
        //     validators: {
        //         choice: {
        //             min: 1,
        //             message: 'Please configure at least one connection'
        //         }
        //     }
        // },
        // 'organization_connections[]': {
        //     validators: {
        //         choice: {
        //             min: 1,
        //             message: 'Please select atleast one connection'
        //         }
        //     }
        // },
        about_business: {
          validators: {
            notEmpty: {
              message: "Please provide more description about your business",
            },
            stringLength: {
              min: 20,
              max: 2000,
              message:
                "The description must be more than 20 characters long & less than 2000",
            },
          },
        },
        business_tag_line: {
          validators: {
            notEmpty: {
              message: "Please provide short description about business",
            },
            stringLength: {
              min: 5,
              max: 500,
              message:
                "The description must be more than 5 characters long & less than 100",
            },
          },
        },
        page_description_tags: {
          validators: {
            notEmpty: {
              message: "Please provide some tags",
            },
          },
        },
        campaign_name: {
          validators: {
            notEmpty: {
              message: "Please provide campaign name",
            },
            stringLength: {
              min: 2,
              max: 50,
              message:
                "The campaign name must be more than 2 and less than 50 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9 ]+$/,
              message:
                "The campaign name can only consist of alphabets, numbers & spaces",
            },
          },
        },
        campaign_topic: {
          validators: {
            notEmpty: {
              message: "Please provide campaign topic",
            },
            stringLength: {
              min: 2,
              max: 50,
              message:
                "The campaign topic must be more than 2 and less than 50 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9 ]+$/,
              message:
                "The campaign topic can only consist of alphabets, numbers & spaces",
            },
          },
        },
        campaign_objective: {
          validators: {
            notEmpty: {
              message: "Please provide campaign objective",
            },
            stringLength: {
              min: 5,
              message: "The campaign objective must be more than 5",
            },
          },
        },
        campaign_video_url: {
          validators: {
            notEmpty: {
              message: "The Campaign Video Url is required",
            },
            // callback: {
            //     //message: 'Please provide Campaign Video URL',
            //     callback: function (value, validator, $field) {
            //
            //         if (value && !isUrlValid(value)) {
            //             return {
            //                 valid: false,
            //                 message: 'Please provide valid Campaign
            // Video URL', }; }  return true; } }
            callback: {
              callback: function (value, validator, $field) {
                var urlType = $field.attr("data-url_type");

                if (urlType && urlType == "youtube") {
                  var video_url_input = value;
                  var video_id = "";
                  var video_url = "";

                  if (ORG_TOP_URLS[video_url_input]) {
                    video_id = ORG_TOP_URLS[video_url_input]["value"];
                    video_url = ORG_TOP_URLS[video_url_input]["url"];
                  } else {
                    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
                    const urlMatches = video_url_input.match(urlRegex);

                    if (urlMatches) {
                      video_url = urlMatches[0];
                    }

                    video_id = getYoutubeVideoId(video_url_input);
                  }

                  if (video_id) {
                    $("#enrich_video_url")
                      .attr("data-video-url", video_url)
                      .attr("data-video-id", video_id);
                    $("#view_campaign_video_url").attr("href", video_url);
                  } else {
                    $("#enrich_video_url")
                      .attr("data-video-url", "")
                      .attr("data-video-id", "");
                    $("#view_campaign_video_url").attr("href", "#");

                    return {
                      valid: false,
                      message: "Campaign Video URL must be youtube URL",
                    };
                  }
                  return true;
                } else {
                  return true;
                }
              },
            },
          },
        },
        campaign_influencers: {
          validators: {
            notEmpty: {
              enabled: false,
              // message: 'Please provide campaign influencers',
            },
            stringLength: {
              min: 2,
              max: 1000,
              message:
                "The campaign influencers must be more than 2 characters long",
            },
          },
        },
        campaign_start_date: {
          validators: {
            notEmpty: {
              message: "Select campaign start date",
            },
            // callback: {
            //     //message: 'Please provide Campaign Video URL',
            //     callback: function (value, validator, $field) {
            //         console.log("CB", value);
            //         if (!value) {
            //             return {
            //                 valid: false,
            //                 message: 'Select campaign start date'
            //             };
            //         }
            //
            //         return true;
            //     }
            // }
          },
        },
        campaign_end_date: {
          validators: {
            notEmpty: {
              message: "Select campaign end date",
            },
          },
        },
        type_of_campaign: {
          validators: {
            choice: {
              min: 1,
              message: "Please select type of campaign",
            },
          },
        },
        campaign_targeted_audience: {
          validators: {
            notEmpty: {
              message: "Please provide campaign targeted audience",
            },
          },
        },
        psychographic: {
          validators: {
            notEmpty: {
              message: "Please provide psychographic",
            },
            stringLength: {
              min: 5,
              message: "The psychographic must be more than 6 characters long",
            },
          },
        },
        target_country: {
          validators: {
            choice: {
              min: 1,
              message: "Please select target country",
            },
          },
        },
        target_state: {
          validators: {
            choice: {
              min: 1,
              message: "Please select target state",
            },
          },
        },
        target_languages: {
          validators: {
            choice: {
              min: 1,
              message: "Please select target languages",
            },
          },
        },
        "gender[]": {
          validators: {
            choice: {
              min: 1,
              message: "Please choose gender",
            },
          },
        },
        "preferred_channels[]": {
          validators: {
            choice: {
              min: 1,
              message: "Please choose at least one channel",
            },
          },
        },
        file_url: {
          validators: {
            notEmpty: {
              message: "The Campaign File Url is required",
            },
            callback: {
              //message: 'Please provide Campaign Video URL',
              callback: function (value, validator, $field) {
                if (value && !isUrlValid(value)) {
                  return {
                    valid: false,
                    message: "Please provide valid Campaign Video URL",
                  };
                }

                return true;
              },
            },
          },
        },
        wa_template: {
          validators: {
            choice: {
              min: 1,
              message: "Please choose template",
            },
          },
        },
        wa_campaign: {
          validators: {
            choice: {
              min: 1,
              message: "Please choose campaign",
            },
          },
        },
        cta: {
          validators: {
            notEmpty: {
              message: "CTA Url is required",
            },
            callback: {
              //message: 'Please provide Campaign Video URL',
              callback: function (value, validator, $field) {
                if (value && !isUrlValid(value)) {
                  return {
                    valid: false,
                    message: "Please provide valid CTA URL",
                  };
                }

                return true;
              },
            },
          },
        },
        template_name: {
          validators: {
            notEmpty: {
              message: "Please provide template name",
            },
            stringLength: {
              min: 2,
              max: 50,
              message:
                "The templare name must be more than 2 and less than 50 characters long",
            },
            regexp: {
              regexp: /^[a-zA-Z0-9_]+$/,
              message:
                "The template name can only consist of alphabets & numbers",
            },
          },
        },
        "when_to_post[]": {
          trigger: "change keyup",
          validators: {
            // notEmpty: {
            //     message: 'Please select when to post campaign'
            // },
            callback: {
              message: "Please select at least one time",
              callback: function (value, validator, $field) {
                // var formId = validator.$form.attr('id');
                // var fieldName = $field.attr('name');
                // console.log($('#' + formId + ' input[name="'+
                // fieldName +'"]'));

                // Tweak for getting data rather than going and
                // fetching all fields
                var formData = getFormData(validator.$form);
                var whenToPost = formData["when_to_post[]"] || "";
                whenToPost = getArrayFromData(whenToPost);

                if (whenToPost.length === 0) {
                  return {
                    valid: false,
                    message: "Please select when to post campaign",
                  };
                }

                return true;
              },
            },
          },
        },
        campaign_comment: {
          validators: {
            notEmpty: {
              message: "Please provide information about campaign",
            },
            stringLength: {
              min: 5,
              message: "The information must be more than 5 characters long",
            },
          },
        },
        campaign_subject: {
          validators: {
            notEmpty: {
              message: "Please provide subject for campaign",
            },
            stringLength: {
              min: 5,
              message: "Subject must be more than 5 characters long",
            },
          },
        },
        campaign_to: {
          validators: {
            notEmpty: {
              message: "Please provide list",
            },
          },
        },
        review_comments: {
          validators: {
            notEmpty: {
              message: "Please specify comments",
            },
            stringLength: {
              min: 5,
              message: "The comments must be more than 5 characters long",
            },
          },
        },
        facebook_page: {
          validators: {
            choice: {
              min: 1,
              max: 1,
              message: "Please select the page you want to use",
            },
          },
        },
        instagram_page: {
          validators: {
            choice: {
              min: 1,
              max: 1,
              message: "Please select the page you want to use",
            },
          },
        },
        template_body: {
          validators: {
            notEmpty: {
              message: "Please provide information about template body",
            },
            stringLength: {
              min: 5,
              message: "The information must be more than 5 characters long",
            },
          },
        },
      },
    }
  );

  if ($("form.needs-validation").attr("data-custom_errors_container")) {
    $.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend(
      {},
      $.fn.bootstrapValidator.DEFAULT_OPTIONS,
      {
        container:
          "." + $("form.needs-validation").attr("data-custom_errors_container"),
      }
    );
  }

  $("form.needs-validation").bootstrapValidator();
  // .on('status.field.bv', function (e, data) {
  //     if (data.bv.getSubmitButton()) {
  //         // Enable submit button always
  //         data.bv.disableSubmitButtons(false);
  //     }
  // });

  $(document).on("click", "#enrich_video_url", function () {
    var video_url = $(this).attr("data-video-url") || false;
    var video_id = $(this).attr("data-video-id") || false;
    if (video_url) {
      getEnrichSettings(video_url, video_id);
    }
  });

  $(".competitor_1_preview").click(function () {
    $(this).attr("href", "https://youtube.com/" + $("#competitor_1").val());
  });

  $(".competitor_2_preview").click(function () {
    $(this).attr("href", "https://youtube.com/" + $("#competitor_2").val());
  });
}

function getYoutubeVideoId(url) {
  var regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
  var match = url.match(regExp);
  if (match && match.length >= 2) {
    return match[2];
  } else {
    return false;
  }
}

function getEnrichSettings(videoUrl, videoId) {
  showProcessingToast("Fetching Video details .... ");

  var inputData = {
    ajax_source: CAMPAIGN_AJAX_SOURCE,
    from_ajax: true,
    form_source: "get_enrich_video_details",
    video_id: videoId,
    video_url: videoUrl,
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
}

async function showEnrichVideoSettings(videoUrl, videoDetails) {
  return await Swal.fire({
    position: "top",
    title: "Enrich Video",
    html:
      '<div class="form-group mb-4">\n' +
      '\t\t\t\t\t\t<input type="hidden" class="form-control" id="enrich_video_id" name="enrich_video_id" value="' +
      videoDetails.video_id +
      '" placeholder="Video ID">\n' +
      '\t\t\t\t\t\t<input type="hidden" class="form-control" id="enrich_video_category_id" name="enrich_video_category_id" value="' +
      videoDetails.category_id +
      '" placeholder="Video Category">\n' +
      "\t\t\t\t\t\t<p>Channel Title</p>\n" +
      '\t\t\t\t\t\t<p class="bold">' +
      videoDetails.channel_name +
      "</p>\n" +
      "\t\t\t\t\t</div>" +
      '<div class="form-group mb-4">\n' +
      "\t\t\t\t\t\t<p>Video URL</p>\n" +
      '\t\t\t\t\t\t<a href="' +
      videoUrl +
      '" target="_blank">' +
      videoUrl +
      "</a>\n" +
      "\t\t\t\t\t</div>" +
      '<div class="form-group mb-4">\n' +
      '\t\t\t\t\t\t<label for="enrich_video_title">Title</label>\n' +
      '\t\t\t\t\t\t<input type="text" class="form-control" id="enrich_video_title" name="enrich_video_title" value="' +
      videoDetails.title +
      '" placeholder="Video Title">\n' +
      "\t\t\t\t\t</div>" +
      '<div class="form-group mb-4">\n' +
      '\t\t\t\t\t\t<label for="enrich_video_description">Description</label>\n' +
      '\t\t\t\t\t\t<textarea class="form-control" id="enrich_video_description" name="enrich_video_description"  placeholder="Video Description">' +
      videoDetails.description +
      " </textarea>\n" +
      "\t\t\t\t\t</div>" +
      '<div class="form-group mb-4">\n' +
      '\t\t\t\t\t\t<label for="enrich_video_1">Tags</label>\n' +
      '\t\t\t\t\t\t<textarea class="form-control" id="enrich_video_tags" name="enrich_video_tags" placeholder="Video Tags">' +
      videoDetails.tags +
      "</textarea>\n" +
      "\t\t\t\t\t</div>",
    focusConfirm: false,
    confirmButtonText: "Enrich",
    preConfirm: () => {
      showProcessingToast("Fetching Video details .... ");

      var inputData = {
        ajax_source: CAMPAIGN_AJAX_SOURCE,
        from_ajax: true,
        form_source: "save_enrich_video_details",
        video_id: $("#enrich_video_id").val(),
        title: $("#enrich_video_title").val(),
        description: $("#enrich_video_description").val(),
        tags: $("#enrich_video_tags").val(),
        category_id: $("#enrich_video_category_id").val(),
      };

      $.ajax({
        url: inputData["ajax_source"],
        type: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(inputData),
        success: function (responseData) {
          ajaxSuccessResponse(responseData, "", inputData);
        },
        error: function (error) {
          ajaxFailedResponse(error, "", inputData);
        },
      });
    },
  });
}

function trimChar(string, charToRemove) {
  while (string.charAt(0) === charToRemove) {
    string = string.substring(1);
  }

  while (string.charAt(string.length - 1) === charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
}

function enableActiveConnection(connection_selector) {
  $(connection_selector)
    .removeAttr("disabled")
    .parent()
    .removeClass("disabled")
    .removeAttr("disabled");
  // $($(connection_selector).closest("form")).bootstrapValidator('addField',
  // $(connection_selector));
}

function selectActiveConnection(connection_selector) {
  $(connection_selector)
    .bootstrapToggle("on", true)
    .removeAttr("disabled")
    .parent()
    .removeClass("disabled")
    .removeAttr("disabled");
}

function disableActiveSelector(connection_selector) {
  $(connection_selector).bootstrapToggle("off", true).attr("disabled", "true");
  $(connection_selector)
    .attr("disabled", "true")
    .parent()
    .addClass("disabled")
    .attr("disabled", "true");
  // $($(connection_selector).closest("form")).bootstrapValidator('removeField',
  // $(connection_selector));
}

function changeTargetViewers(share_with_others) {
  share_with_others =
    share_with_others ||
    $("#share_with_captive_members").prop("checked") ||
    false;

  if (!share_with_others) {
    $(".target_viewers").show();
  } else {
    $(".target_viewers").hide();
  }
}

function getFormData(element) {
  var wholeFormData = {
    from_ajax: true,
    ajax_source: element.attr("action"),
  };

  $.each($(element).serializeArray(), function (index, data) {
    // If we have same name elements for ex: checkboxes, multiple
    // selects automatically selected values will be converted to
    // array
    if (wholeFormData.hasOwnProperty(data.name)) {
      if (Array.isArray(wholeFormData[data.name])) {
        wholeFormData[data.name].push(data.value);
      } else {
        var previousValue = wholeFormData[data.name];
        wholeFormData[data.name] = [previousValue, data.value];
      }
    } else {
      wholeFormData[data.name] = data.value;
    }
  });

  return wholeFormData;
}

function processData(formElement) {
  var inputData = getFormData($(formElement));
  if (inputData["ajax_source"] !== undefined) {
    if (inputData["ajax_source"] == "whatsapp_content_curation") {
      var selectedTemplateStatus = $("#wa_template")
        .find(":selected")
        .data("status");
      if (selectedTemplateStatus != "APPROVED") {
        showErrorMessageToast(
          "Only Approved Templates Can Be Broadcasted",
          "Error",
          {
            positionClass: "toast-top-right",
          }
        );
        return false;
      }
    }

    if (inputData["form_source"] == "whatsapp_content_curation") {
      if (
        !$(".display_img_picker_for_template").hasClass("d-none") &&
        $("#file_url").val() == ""
      ) {
        showErrorMessageToast("Select a file.");
        return false;
      }
    }

    if (inputData["curation_channel"] == "Youtube") {
      inputData.publish_video_as = $(".publish_video_as").val();
    }
    $.ajax({
      url: inputData["ajax_source"],
      type: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(inputData),
      success: function (responseData) {
        ajaxSuccessResponse(responseData, formElement, inputData);
      },
      error: function (error) {
        ajaxFailedResponse(error, formElement, inputData);
      },
    });
  }
}

function ajaxSuccessResponse(responseData, formElement, formData) {
  toastr.clear();

  // Success response read data
  if (responseData.status === true) {
    if (responseData.data.message !== undefined) {
      // showSuccessMessage(responseData.data.message, formElement);
      showSuccessMessageToast(responseData.data.message, "", {
        positionClass: "toast-top-center",
      });
    }

    if (responseData.data.extra !== undefined) {
      processExtraAjaxData(responseData.data.extra, formData, formElement);
    }

    if (responseData.data.allLeads && responseData.data.allLeads.length > 0) {
      setWhatsappLeadDetailsGraph(responseData.data);
    }

    if (responseData.data.allLeads && responseData.data.allLeads.length == 0) {
      setWhatsappLeadDetailsGraph(responseData.data);
    }
  } else {
    // Read error message
    if (
      (responseData.error.message_type !== undefined &&
        responseData.error.message_type === "toast") ||
      !formElement
    ) {
      showErrorMessageToast(responseData.error.message, "", {
        positionClass: "toast-top-center",
      });
    } else {
      showErrorMessage(responseData.error.message, formElement);
    }

    if (responseData.error.extra !== undefined) {
      processExtraAjaxData(responseData.error.extra, formData, formElement);
    }
  }
}

function setWhatsappLeadDetailsGraph(whatsappLeadDetails) {
  if (whatsappLeadDetails.message == "Whatsapp Not Connected") {
    $(".total_msgs").html(
      "<h2 class='total_msgs text-center'>Whatsapp not connected...</h2>"
    );
    return false;
  }
  $(".total_msgs span").html(whatsappLeadDetails.allLeads.length);
  var chart = new CanvasJS.Chart("whatsappAnalysisChart", {
    animationEnabled: true,
    title: {
      text: "",
    },
    data: [
      {
        type: "funnel",
        indexLabel: "{label}",
        toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
        neckWidth: 20,
        neckHeight: 0,
        valueRepresents: "area",
        dataPoints: [
          {
            y: whatsappLeadDetails.totalSent,
            label: `Sent ${whatsappLeadDetails.totalSent}/${whatsappLeadDetails.allLeads.length}`,
            color: "#40C9E8",
          },
          {
            y: whatsappLeadDetails.totalFailed,
            label: `Failed ${whatsappLeadDetails.totalFailed}/${whatsappLeadDetails.allLeads.length}`,
            color: "#3AA6D1",
          },
          {
            y: whatsappLeadDetails.totalReceived,
            label: `Received ${whatsappLeadDetails.totalReceived}/${whatsappLeadDetails.totalSent}`,
            color: "#4D83B3",
          },
          {
            y: whatsappLeadDetails.totalRead,
            label: `Read ${whatsappLeadDetails.totalRead}/${whatsappLeadDetails.totalReceived}`,
            color: "#325F8A",
          },
          {
            y: whatsappLeadDetails.totalReplied,
            label: `Replied ${whatsappLeadDetails.totalReplied}/${whatsappLeadDetails.totalRead}`,
            color: "#2B4377",
          },
        ],
      },
    ],
  });
  var dataPoint = chart.options.data[0].dataPoints;
  chart.options.data[0].dataPoints[0].percentage = (
    (dataPoint[0].y / whatsappLeadDetails.allLeads.length) *
    100
  ).toFixed(2);
  chart.options.data[0].dataPoints[1].percentage = (
    (dataPoint[0].y / whatsappLeadDetails.allLeads.length) *
    100
  ).toFixed(2);
  chart.options.data[0].dataPoints[2].percentage = (
    (dataPoint[1].y / whatsappLeadDetails.totalSent) *
    100
  ).toFixed(2);
  chart.options.data[0].dataPoints[3].percentage = (
    (dataPoint[2].y / whatsappLeadDetails.totalReceived) *
    100
  ).toFixed(2);
  chart.options.data[0].dataPoints[4].percentage = (
    (dataPoint[3].y / whatsappLeadDetails.totalRead) *
    100
  ).toFixed(2);
  chart.render();
}

function ajaxFailedResponse(errorData, formElement, formData) {
  toastr.clear();

}

function showErrorMessage(messages, formElement) {
  $(formElement).prepend(
    "<div class='form-status error'>" + messages + "</div>"
  );
}

function showSuccessMessage(messages, formElement) {
  $(formElement).prepend(
    "<div class='form-status success'>" + messages + "</div>"
  );

  setTimeout(function () {
    $(".form-status.success").fadeOut().remove();
  }, 5000);
}

function processExtraAjaxData(extraData, formData, formElement) {
  toastr.clear();

  switch (formData.form_source) {
    case "deleteUser":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

    case "currentOrganization":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

    case "connect_whatsapp":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

    case "connect_google_reviews":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

    case "organization":
      // Create
      if (extraData.organization_id !== undefined) {
        $("#form_main_action_button").text("Update");
        $("#organization_id").val(extraData.organization_id);
      }
      break;

    case "business":
      // Create
      if (extraData.business_id !== undefined) {
        $("#form_main_action_button").text("Update");
        $("#business_id").val(extraData.business_id);
      }
      break;

    case "strategy_definition":
      // Create
      if (extraData.campaign_id !== undefined) {
        // $('#form_main_action_button').text("Update");
        $("#campaign_id").val(extraData.campaign_id);
      }

      if (
        formData.button_source !== undefined &&
        formData.button_source === "save_continue"
      ) {
        if (extraData.next_screen !== undefined) {
          setTimeout(function () {
            window.location.href = extraData.next_screen;
          }, 3000);
        }
      }
      break;

    case "target_viewers":
      // Create
      if (extraData.campaign_viewers_id !== undefined) {
        $("#campaign_viewers_id").val(extraData.campaign_viewers_id);
      }

      if (
        formData.button_source !== undefined &&
        formData.button_source === "save_continue"
      ) {
        if (extraData.next_screen !== undefined) {
          setTimeout(function () {
            window.location.href = extraData.next_screen;
          }, 3000);
        }
      }
      break;

    case "channel_selection":
      // Create
      if (extraData.campaign_viewers_id !== undefined) {
        $("#campaign_viewers_id").val(extraData.campaign_viewers_id);
      }

      if (
        formData.button_source !== undefined &&
        formData.button_source === "save_continue"
      ) {
        if (extraData.next_screen !== undefined) {
          setTimeout(function () {
            window.location.href = extraData.next_screen;
          }, 3000);
        }
      }
      break;

    case "content_curation":
      if (extraData.next_tab !== undefined && extraData.next_tab === true) {
        // Remove buttons for preventing to edit again
        $(formElement).find(".content_action_buttons").remove();

        $("#channel_" + formData.curation_channel_unique_name + "_content")
          .removeClass("show") // Hide current one
          .parent()
          .next()
          .find(".accordion-collapse")
          .addClass("show"); // Show next one
      }

      break;

    case "content_calendar":
      if (
        formData.button_source !== undefined &&
        formData.button_source === "approve_campaign"
      ) {
        if (extraData.next_screen !== undefined) {
          setTimeout(function () {
            window.location.href = extraData.next_screen;
          }, 3000);
        }
      }

      break;

    case "login":
    case "add_new_user":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "add_new_employee":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "add_new_agency":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "updateAgencyEmployee":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "updateEmployeeDetails":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "updatedAgencyDetails":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 1000);
      }
      break;

    case "connection_configuration":
      var connection_selector = formData.connection_selector;
      var connection_configuration_toggle_element_selector =
        formData.connection_configuration_toggle_element;
      var connection_configuration_toggle_element = $(
        connection_configuration_toggle_element_selector
      );

      if (extraData.isConfigured === true) {
        enableConfigurationAndEnableActiveConnection(
          connection_configuration_toggle_element,
          connection_selector
        );
        window.location.reload();
      } else {
        disableConfigurationAndDisableActiveConnection(
          connection_configuration_toggle_element,
          connection_selector
        );
        window.location.reload();
      }
      break;

    case "update_connection_configuration":
      var connection_selector = formData.connection_selector;
      var connection_configuration_toggle_element_selector =
        formData.connection_configuration_toggle_element;
      var connection_configuration_toggle_element = $(
        connection_configuration_toggle_element_selector
      );

      if (extraData.isConfigurationRemoved === true) {
        disableConfigurationAndDisableActiveConnection(
          connection_configuration_toggle_element,
          connection_selector,
          "You have removed link to your " +
            formData.connection_name +
            " account & disabled connection"
        );
      } else {
        enableConfigurationAndEnableActiveConnection(
          connection_configuration_toggle_element,
          connection_selector,
          true
        );

        Swal.fire({
          position: "top",
          iconHtml: '<i class="fa fa-chain"></i>',
          iconColor: "#d33",
          title:
            "Your " +
            formData.connection_name +
            " account connection could not be removed",
          showConfirmButton: false,
          timer: 3500,
          showClass: {
            popup: "animate__animated animate__zoomIn",
          },
          hideClass: {
            popup: "animate__animated animate__zoomOutDown",
          },
        });
      }
      break;

    case "get_enrich_video_details":
      showEnrichVideoSettings(formData.video_url, extraData).then(function (
        settingsData
      ) {
        if (!settingsData.isConfirmed) {
          showWarningMessageToast("You did't change any settings");
        }
      });
      break;

    case "add_template":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

    case "whatsapp_content_curation":
      if (extraData.next_screen !== undefined) {
        setTimeout(function () {
          window.location.href = extraData.next_screen;
        }, 3000);
      }
      break;

      break;
  }
}

function showWarningMessageToast(message, title, options) {
  toastr.clear();

  title = title || "";
  options = options || [];

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: options.positionClass || "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "200",
    hideDuration: "10000",
    timeOut: "30000",
    extendedTimeOut: "10000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  toastr.warning(message, title);
}

function showInfoMessageToast(message, title, options) {
  toastr.clear();

  title = title || "";
  options = options || [];

  toastr.options = {
    closeButton: options.closeButton !== undefined ? options.closeButton : true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: options.positionClass || "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "200",
    hideDuration: "30000",
    timeOut: "60000",
    extendedTimeOut: "30000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  toastr.info(message, title);
}

function showErrorMessageToast(message, title, options) {
  toastr.clear();

  title = title || "";
  options = options || [];

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: options.positionClass || "toast-top-center",
    preventDuplicates: true,
    onclick: null,
    showDuration: "200",
    hideDuration: "10000",
    timeOut: "30000",
    extendedTimeOut: "10000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  toastr.error(message, title);
}

function showSuccessMessageToast(message, title, options) {
  toastr.clear();

  title = title || "";
  options = options || [];

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: options.positionClass || "toast-top-center",
    preventDuplicates: true,
    onclick: null,
    showDuration: "1000",
    hideDuration: "1500",
    timeOut: "10000",
    extendedTimeOut: "2000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  toastr.success(message, title);
}

function showToastNotification(notification) {
  if (notification.type === "error") {
    showErrorMessageToast(notification.message, "", {
      positionClass: notification.positionClass || "toast-top-center",
    });
  }
  if (notification.type === "success") {
    showSuccessMessageToast(notification.message, "", {
      positionClass: notification.positionClass || "toast-top-center",
    });
  }
  if (notification.type === "info") {
    showInfoMessageToast(notification.message, "", {
      positionClass: notification.positionClass || "toast-top-center",
    });
  }
  if (notification.type === "warning") {
    showWarningMessageToast(notification.message, "", {
      positionClass: notification.positionClass || "toast-top-center",
    });
  }
}

function showProcessingToast(message) {
  message = message || "Processing your request..";
  showInfoMessageToast(
    "",
    '<div class="d-flex align-items-center justify-content-between">' +
      "<span>" +
      message +
      "</span>" +
      '&nbsp;<div class="spinner-border" role="status"></div>' +
      "</div>",
    {
      positionClass: "toast-top-center",
      closeButton: false,
    }
  );
}

deleteLeadFromDb = (id) => {
  var inputData = {
    ajax_source: "leads/ajax",
    from_ajax: true,
    form_source: "delete_lead",
    lead_id: id,
  };
  showProcessingToast();

  $.ajax({
    url: "/leads/ajax",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
      window.location.reload();
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
};

markAsReadSocialInbox = (id, sts) => {
  var inputData = {
    ajax_source: "leads/ajax",
    from_ajax: true,
    form_source: "read_inbox_msg",
    inbox_id: id,
    inbox_read_status: sts,
  };
  showProcessingToast();

  $.ajax({
    url: "/leads/ajax",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
};

function showNotifications() {
  var notifications_field = $("#notifications").val();
  var notifications =
    notifications_field !== null &&
    notifications_field !== undefined &&
    notifications_field !== "" &&
    notifications_field !== "null"
      ? JSON.parse(notifications_field)
      : [];

  if (notifications.length > 0) {
    notifications.forEach(function (notification, index) {
      showToastNotification(notification);
    });
  }
}

function capitalize(string) {
  if (typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isUrlValid(userInputUrl) {
  var res = userInputUrl.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) {
    return false;
  } else {
    return true;
  }
}

function getReadableDate(date) {
  // weekday : possible values are "narrow", "short" & "long"
  // era : possible values are "narrow", "short" & "long"
  // year : possible values are "numeric" & "2-digit"
  // month : possible values are "numeric", "2-digit", "narrow", "short" &
  // "long" day : possible values are "numeric" & "2-digit" hour : possible
  // values are "numeric" & "2-digit" minute : possible values are "numeric"
  // & "2-digit" second : possible values are "numeric" & "2-digit"

  return new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function getCampaignPostAtDatesList(dates) {
  var campaignPostAt = "<ul class='post_at_times_list'>";
  var postAtDates = getArrayFromData(dates);
  postAtDates.forEach(function (date, index) {
    campaignPostAt += "<li>" + getReadableDate(date) + "</li>";
  });
  campaignPostAt += "</ul>";
  return campaignPostAt;
}

function getArrayFromData(data) {
  var finalArray = [];

  if (data) {
    if (!Array.isArray(data)) {
      finalArray.push(data);
    } else {
      finalArray = data;
    }

    // Removing empty values
    finalArray = finalArray.filter((item) => item);
  }

  return finalArray;
}

function handleGoogleAuthLoginResponse(googleUser) {
  showProcessingToast();

  var inputData = {
    ajax_source: LOGIN_AJAX_SOURCE,
    from_ajax: true,
    form_source: "login",
    login_type: "social",
    login_provider: "google",
    provider_data: googleUser,
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
}

function enableConfigurationAndEnableActiveConnection(
  connection_configuration_toggle_element,
  connection_selector,
  no_alert
) {
  toastr.clear();

  var connection_name = connection_configuration_toggle_element.attr(
    "data-connection_setting_name"
  );
  connection_configuration_toggle_element.attr("checked", "true");
  connection_configuration_toggle_element.bootstrapToggle("on", true);
  enableActiveConnection(connection_selector);
  selectActiveConnection(connection_selector);
  no_alert = no_alert || false;

  if (!no_alert) {
    Swal.fire({
      position: "top",
      icon: "success",
      title:
        "You have linked your " +
        connection_name +
        " account & enabled connection",
      showConfirmButton: false,
      timer: 5000,
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOutDown",
      },
    });
  }
}

function disableConfigurationAndDisableActiveConnection(
  connection_configuration_toggle_element,
  connection_selector,
  title
) {
  toastr.clear();

  var connection_name = connection_configuration_toggle_element.attr(
    "data-connection_setting_name"
  );
  connection_configuration_toggle_element.attr("checked", "false");
  connection_configuration_toggle_element.bootstrapToggle("off", true);

  disableActiveSelector(connection_selector);

  title = title
    ? title
    : "You didn't link your " + connection_name + " account";

  Swal.fire({
    position: "top",
    iconHtml: '<i class="fa fa-chain-broken"></i>',
    iconColor: "#d33",
    title: title,
    showConfirmButton: false,
    timer: 3500,
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOutDown",
    },
  });

 window.location.reload();
}

function showOauthConnectionStatus() {
  var connectionStatus = CONNECTION_OAUTH_STATUS || [];

  if (connectionStatus.length === 0) {
    return;
  }

  if (!connectionStatus.status && connectionStatus.error) {
    Swal.fire({
      position: "top",
      iconHtml: '<i class="fa fa-chain-broken"></i>',
      iconColor: "#d33",
      title: connectionStatus.error.message,
      showConfirmButton: false,
      timer: 3500,
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOutDown",
      },
    });
  } else if (connectionStatus.provider_connection_name){
    Swal.fire({
      position: "top",
      icon: "success",
      title:
        "You have linked your " +
        connectionStatus.provider_connection_name +
        " account & enabled connection",
      showConfirmButton: false,
      timer: 5000,
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOutDown",
      },
    });
  }
}

function handleConfigurationConnections(
  connection_configuration_toggle_element,
  isDummy
) {
  var connection_selector =
    "#" +
    connection_configuration_toggle_element.attr("data-connection_setting_id");
  var connection_configuration_function =
    connection_configuration_toggle_element.attr("data-api_custom_callback");
  isDummy = isDummy || false;

  if (isDummy) {
    configureDummyConnection(
      connection_configuration_toggle_element,
      connection_selector
    );
  } else {
    if (typeof window[connection_configuration_function] === "function") {
      window[connection_configuration_function](
        connection_configuration_toggle_element,
        connection_selector
      );
    } else {
      console.log("No function available", connection_configuration_function);
    }
  }
  // window.location.reload();
}

// Called from handleConfigurationConnections dynamically
function configureFacebookConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  let facebookConfiguration = new configureFacebookConnectionClass();
  facebookConfiguration.setData(
    connection_configuration_toggle_element,
    connection_selector
  );
  facebookConfiguration.checkLoginStatus();
}

// Called from handleConfigurationConnections dynamically
function configureYoutubeConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  let youtubeConfiguration = new configureYoutubeConnectionClass();
  youtubeConfiguration.setData(
    connection_configuration_toggle_element,
    connection_selector
  );
  youtubeConfiguration.checkLoginStatus();
}

// Called from handleConfigurationConnections dynamically
function configureInstagramConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  let instagramConfiguration = new configureInstagramConnectionClass();
  instagramConfiguration.setData(
    connection_configuration_toggle_element,
    connection_selector
  );
  instagramConfiguration.checkLoginStatus();
}

// Called from handleConfigurationConnections dynamically
function configureGoogleDriveConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  let configureGoogleDriveConnectionConfiguration =
    new configureGoogleDriveConnectionClass();
  configureGoogleDriveConnectionConfiguration.setData(
    connection_configuration_toggle_element,
    connection_selector
  );
  configureGoogleDriveConnectionConfiguration.checkLoginStatus();
}

// Called from handleConfigurationConnections dynamically
function configureEmailConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  let configureEmailConnectionConfiguration =
    new configureEmailConnectionClass();
  configureEmailConnectionConfiguration.setData(
    connection_configuration_toggle_element,
    connection_selector
  );
  configureEmailConnectionConfiguration.collectInformation();
}

// Just calls API directly & saves it
function configureDummyConnection(
  connection_configuration_toggle_element,
  connection_selector
) {
  var connection_name = connection_configuration_toggle_element.attr(
    "data-connection_setting_name"
  );

  showProcessingToast("Saving your " + connection_name + " connection ....");

  var inputData = {
    ajax_source: ADMINS_AJAX_SOURCE,
    from_ajax: true,
    form_source: "connection_configuration",
    connection_type: "promulgate_channel",
    connection_name: connection_name,
    connection_media_type: connection_configuration_toggle_element.attr(
      "data-connection_media_type"
    ),
    connection_configuration_toggle_element:
      "#" + connection_configuration_toggle_element.attr("id"),
    connection_selector: connection_selector,
    promulgate_channel: encodeURIComponent(
      JSON.stringify({
        no_data: true,
      })
    ),
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
}

class configureFacebookConnectionClass {
  setData = (connection_configuration_toggle_element, connection_selector) => {
    this.connection_configuration_toggle_element =
      connection_configuration_toggle_element;
    this.connection_selector = connection_selector;
  };

  setUserId = (userId) => {
    this.userId = userId;
  };

  logoutFromFacebook = () => {
    FB.logout(function (response) {
      //  console.log("User logged out", response);
    });
  };

  getFacebookUserInfo = () => {
    FB.api(
      "/me",
      "get",
      {
        fields: "name, first_name, last_name, email, picture",
      },
      function (response) {
        //console.log("ME Response", response);
      }
    );
  };

  processPagesList = (response) => {
    if (response.data && response.data.length) {
      var pagesList = {};
      var pagesListOptionsHtml = "";
      var fbUserId = this.userId;

      pagesListOptionsHtml = '<div class="btn-group-vertical" role="group">';
      $.each(response.data, function (index, pageData) {
        pagesList[pageData.id] = {
          id: pageData.id,
          user_id: fbUserId,
          name: pageData.name,
          category: pageData.category,
          access_token: pageData.access_token,
        };

        pagesListOptionsHtml +=
          '<input type="radio" class="btn-check" name="facebook_page" id="facebook_page_' +
          pageData.id +
          '" value="' +
          encodeURIComponent(JSON.stringify(pagesList[pageData.id])) +
          '" autocomplete="off">\n' +
          '  <label class="btn btn-outline-promulgate-primary" for="facebook_page_' +
          pageData.id +
          '">' +
          pageData.name +
          "</label>";
      });
      pagesListOptionsHtml += "</div>";

      var connection_name = this.connection_configuration_toggle_element.attr(
        "data-connection_setting_name"
      );

      Swal.fire({
        position: "center",
        title: "Select Facebook Page",
        html:
          '<div class="text-center"><form class="needs-validation" action="' +
          ADMINS_AJAX_SOURCE +
          '" novalidate data-custom_errors_container="form-error-messages-block">\n' +
          '<input type="hidden" name="form_source" id="form_source" value="connection_configuration">\n' +
          '<input type="hidden" name="connection_type" id="connection_type" value="facebook_page">\n' +
          '<input type="hidden" name="connection_name" id="connection_name" value="' +
          connection_name +
          '">\n' +
          '<input type="hidden" name="connection_media_type" id="connection_media_type" value="' +
          this.connection_configuration_toggle_element.attr(
            "data-connection_media_type"
          ) +
          '">\n' +
          '<input type="hidden" name="connection_configuration_toggle_element" id="connection_configuration_toggle_element" value="#' +
          this.connection_configuration_toggle_element.attr("id") +
          '">\n' +
          '<input type="hidden" name="connection_selector" id="connection_selector" value="' +
          this.connection_selector +
          '">\n' +
          '<div class="row mt-2">' +
          pagesListOptionsHtml +
          "<div>" +
          '<div class="row">\n' +
          '\t\t\t\t\t<div class="form-error-messages-block"></div>\n' +
          "\t\t\t\t</div>\n" +
          '\t\t\t\t<div class="row mt-3">\n' +
          '\t\t\t\t\t<div class="text-center">\n' +
          '\t\t\t\t\t\t<button class="btn btn-min btn-success" type="submit">Confirm</button>\n' +
          "\t\t\t\t\t</div>\n" +
          "\t\t\t\t</div>" +
          "</form></div>",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        buttonsStyling: false,
        reverseButtons: false,
        confirmButtonText: "Confirm",
        focusConfirm: false,
        allowEscapeKey: true,
        allowOutsideClick: false,
        showLoaderOnConfirm: false,
        // closeOnConfirm: false,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
        didOpen: () => {
          enableBootstrapValidator();
        },
      });
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "You don't have any pages available in your Facebook Account"
      );
    }
    // window.location.reload();
    this.logoutFromFacebook();
  };

  getFacebookUserPagesList = (response) => {
    var accessToken = response.access_token;
    var fbUserId = this.userId;

    FB.api(
      "/" + fbUserId + "/accounts",
      "get",
      {
        access_token: accessToken,
      },
      this.processPagesList
    );
  };

  getFacebookUserRefreshAccessToken = (fbUserId, loginToken) => {
    this.setUserId(fbUserId);

    FB.api(
      "/oauth/access_token",
      {
        grant_type: "fb_exchange_token",
        client_id: FACEBOOK_APP_CLIENT_ID,
        client_secret: FACEBOOK_APP_CLIENT_SECRET,
        fb_exchange_token: loginToken,
      },
      this.getFacebookUserPagesList
    );
  };

  processLoginResponse = (response, error) => {
    if (response.authResponse) {
      var userId = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      //var grantedScopes = response.authResponse.grantedScopes;

      this.getFacebookUserRefreshAccessToken(userId, accessToken);
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "You have cancelled facebook login"
      );
    }
  };

  showFacebookLogin = () => {
    FB.login(this.processLoginResponse, {
      scope:
        this.connection_selector === "#connection_whatsapp"
          ? "public_profile,pages_show_list,read_insights,whatsapp_business_management"
          : "public_profile,business_management,pages_show_list,pages_manage_posts,read_insights,pages_read_engagement,pages_read_user_content",
      return_scopes: true,
    });
  };

  loginStatus = (response) => {
    if (response.status === "connected") {
      // The user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid0 access token, a signed
      // request, and the time the access token
      // and signed request each expire.
      this.processLoginResponse(response);
    } else if (response.status === "not_authorized") {
      // The user hasn't authorized your application.  They
      // must click the Login button, or you must call FB.login
      // in response to a user gesture, to launch a login dialog.
      this.showFacebookLogin();
    } else {
      // The user isn't logged in to Facebook. You can launch a
      // login dialog with a user gesture, but the user may have
      // to log in to Facebook before authorizing your application.
      this.showFacebookLogin();
    }
  };

  checkLoginStatus = () => {
    FB.getLoginStatus(this.loginStatus);
  };
}

class configureYoutubeConnectionClass {
  setData = (connection_configuration_toggle_element, connection_selector) => {
    this.connection_configuration_toggle_element =
      connection_configuration_toggle_element;
    this.connection_selector = connection_selector;
    this.AuthCode = null;
  };

  setUserId = (userId) => {
    this.userId = userId;
  };

  setAuthCode = (code) => {
    this.AuthCode = code;
  };

  checkLoginStatus = () => {
    gapi.load("client:auth2", this.initClient);
  };

  initClient = () => {
    gapi.auth2.init({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      api_key: GOOGLE_YOUTUBE_API_KEY,
    });

    showProcessingToast("Connecting to your youtube account ...");

    gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess({
        scope:
          "https://www.googleapis.com/auth/youtube.upload " +
          "https://www.googleapis.com/auth/youtube " +
          "https://www.googleapis.com/auth/youtube.readonly " +
          "https://www.googleapis.com/auth/business.manage",
        //  prompt: 'none',
        access_type: "offline",
      })
      .then(this.authorizedUser, this.unAuthorizedUser);
  };

  authorizedUser = (authCode) => {
    showProcessingToast("Connecting to Youtube account for fetching channels");

    this.setAuthCode(authCode.code);
    gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(this.getYoutubeChannelsList, this.youtubeLibraryError);
  };

  getYoutubeChannelsList = () => {
    showProcessingToast("Fetching youtube channels ...");

    gapi.client.youtube.channels
      .list({
        part: [
          "snippet",
          // "snippet,contentDetails,statistics"
        ],
        mine: true,
      })
      .then(this.processChannels, this.youtubeLibraryError);
  };

  processChannels = (channels) => {
    showProcessingToast("Saving youtube channel information");

    var channelsList = channels.result;
    if (
      channelsList &&
      channelsList.kind === "youtube#channelListResponse" &&
      channelsList.pageInfo.totalResults > 0 &&
      Object.keys(channelsList.items)[0]
    ) {
      var youtubeChannelDetails = {
        channel_id: channelsList.items[0].id,
        title: channelsList.items[0].snippet.title,
        description: channelsList.items[0].snippet.description,
        userAccountAuthCode: this.AuthCode,
      };
      var connection_name = this.connection_configuration_toggle_element.attr(
        "data-connection_setting_name"
      );
      var mediatype = this.connection_configuration_toggle_element.attr(
        "data-connection_media_type"
      );

      // HUB CONNECTION
      if (mediatype == "hub_connection") {
        showSuccessMessageToast(
          "Youtube hub channel selected successfully, Please click Save/Update for saving the details"
        );
        $("#hub_credentials_" + connection_name).val(
          JSON.stringify(youtubeChannelDetails)
        );
      } else {
        showProcessingToast("Saving youtube channel information");

        // CONNECTION SCREEN SAVE THE CONNECTION
        var inputData = {
          ajax_source: ADMINS_AJAX_SOURCE,
          from_ajax: true,
          form_source: "connection_configuration",
          connection_type: "youtube_channel",
          connection_name: connection_name,
          connection_media_type: mediatype,
          connection_configuration_toggle_element:
            "#" + this.connection_configuration_toggle_element.attr("id"),
          connection_selector: this.connection_selector,
          youtube_channel: encodeURIComponent(
            JSON.stringify(youtubeChannelDetails)
          ),
        };

        $.ajax({
          url: ADMINS_AJAX_SOURCE,
          type: "post",
          dataType: "json",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(inputData),
          success: function (responseData) {
            ajaxSuccessResponse(responseData, "", inputData);
          },
          error: function (error) {
            ajaxFailedResponse(error, "", inputData);
          },
        });
      }
    } else {
      this.youtubeChannelsError(
        "You don't have any youtube channels in your account"
      );
    }
  };

  unAuthorizedUser = (error) => {
    disableConfigurationAndDisableActiveConnection(
      this.connection_configuration_toggle_element,
      this.connection_selector,
      "You haven't authorized your account"
    );
  };

  youtubeLibraryError = (error) => {
    disableConfigurationAndDisableActiveConnection(
      this.connection_configuration_toggle_element,
      this.connection_selector,
      "Could not connect to youtube, please try again"
    );
  };

  youtubeChannelsError = (error) => {
    disableConfigurationAndDisableActiveConnection(
      this.connection_configuration_toggle_element,
      this.connection_selector,
      "Could not fetch youtube channels, Please create one & try again"
    );
  };
}

class configureInstagramConnectionClass {
  setData = (connection_configuration_toggle_element, connection_selector) => {
    this.connection_configuration_toggle_element =
      connection_configuration_toggle_element;
    this.connection_selector = connection_selector;
  };

  setUserId = (userId) => {
    this.userId = userId;
  };

  setPageId = (pageId) => {
    this.pageId = pageId;
  };

  setPagesList(pages) {
    this.pagesList = pages || {};
  }

  logoutFromFacebook = () => {
    FB.logout(function (response) {
      //  console.log("User logged out", response);
    });
  };

  getFacebookUserInfo = () => {
    FB.api(
      "/me",
      "get",
      {
        fields: "name, username, first_name, last_name, email, picture",
      },
      function (response) {
        console.log("ME Response", response);
      }
    );
  };

  getInstagramDetails = () => {
    var pageId = this.pageId;
    if (pageId) {
      showProcessingToast("Fetching Instagram details related to the page");
      FB.api(
        "/" + pageId,
        "get",
        {
          fields: "id,instagram_business_account",
          access_token: this.pagesList[pageId].access_token,
        },
        this.processInstagramDetails
      );
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "You didn't select any Facebook page"
      );
    }
  };

  processInstagramDetails = (instagramDetails) => {
    if (instagramDetails) {
      if (
        instagramDetails.id !== undefined &&
        instagramDetails.instagram_business_account !== undefined
      ) {
        FB.api(
          "/" + instagramDetails.instagram_business_account.id,
          "get",
          {
            access_token: this.pagesList[this.pageId].access_token,
            fields: "id,username",
          },
          this.saveInstagramDetails
        );
      } else {
        disableConfigurationAndDisableActiveConnection(
          this.connection_configuration_toggle_element,
          this.connection_selector,
          "Looks like you haven't added Instagram business account to this page"
        );
      }
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "Could not fetch Instagram details"
      );
    }
    //    window.location.reload();
  };

  saveInstagramDetails = (instagramUserDetails) => {
    var connection_name = this.connection_configuration_toggle_element.attr(
      "data-connection_setting_name"
    );
    showProcessingToast("Saving your " + connection_name + " connection ....");

    var instagramAccountDetails = {
      user_id: this.userId,
      page_id: this.pageId,
      page_access_token: this.pagesList[this.pageId].access_token,
      instagram_account_id: instagramUserDetails.id,
      instagram_account_username: instagramUserDetails.username || "",
    };

    var inputData = {
      ajax_source: ADMINS_AJAX_SOURCE,
      from_ajax: true,
      form_source: "connection_configuration",
      connection_type: "instagram_account",
      connection_name: connection_name,
      connection_media_type: this.connection_configuration_toggle_element.attr(
        "data-connection_media_type"
      ),
      connection_configuration_toggle_element:
        "#" + this.connection_configuration_toggle_element.attr("id"),
      connection_selector: this.connection_selector,
      instagram_pagename: this.pagesList[this.pageId].name,
      instagram_account: encodeURIComponent(
        JSON.stringify(instagramAccountDetails)
      ),
    };

    $.ajax({
      url: ADMINS_AJAX_SOURCE,
      type: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(inputData),
      success: function (responseData) {
        ajaxSuccessResponse(responseData, "", inputData);
      },
      error: function (error) {
        ajaxFailedResponse(error, "", inputData);
      },
    });
  };

  processPagesList = (response) => {
    if (response.data && response.data.length) {
      var userPagesList = {};
      var pagesListOptionsHtml = "";
      var fbUserId = this.userId;

      pagesListOptionsHtml = '<div class="btn-group-vertical" role="group">';
      $.each(response.data, function (index, pageData) {
        userPagesList[pageData.id] = {
          id: pageData.id,
          user_id: fbUserId,
          name: pageData.name,
          category: pageData.category,
          access_token: pageData.access_token,
        };

        pagesListOptionsHtml +=
          '<input type="radio" class="btn-check" name="instagram_page" id="instagram_page' +
          pageData.id +
          '" value="' +
          pageData.id +
          '" autocomplete="off">\n' +
          '  <label class="btn btn-outline-promulgate-primary" for="instagram_page' +
          pageData.id +
          '">' +
          pageData.name +
          "</label>";
      });
      pagesListOptionsHtml += "</div>";

      Swal.fire({
        position: "center",
        title: "Select Facebook Page for Instagram",
        html:
          '<div class="text-center"><form class="needs-validation" novalidate data-custom_errors_container="form-error-messages-block">\n' +
          '<div class="row mt-2">' +
          pagesListOptionsHtml +
          "<div>" +
          '<div class="row">\n' +
          '\t\t\t\t\t<div class="form-error-messages-block"></div>\n' +
          "\t\t\t\t</div>\n" +
          "</form></div>",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-success btn-min",
        },
        buttonsStyling: false,
        reverseButtons: false,
        confirmButtonText: "Confirm",
        focusConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showLoaderOnConfirm: true,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOutDown",
        },
        didOpen: () => {
          enableBootstrapValidator();
        },
        preConfirm: () => {
          this.setPagesList(userPagesList);

          var pageID = $("input[name='instagram_page']:checked").val();
          this.setPageId(pageID);
          this.getInstagramDetails();
        },
      });
      window.location.realod();
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "You don't have any pages available in your Facebook Account"
      );
    }

    this.logoutFromFacebook();
  };

  getFacebookUserPagesList = (response) => {
    var accessToken = response.access_token;
    var fbUserId = this.userId;

    FB.api(
      "/" + fbUserId + "/accounts",
      "get",
      {
        access_token: accessToken,
      },
      this.processPagesList
    );
  };

  getFacebookUserRefreshAccessToken = (fbUserId, loginToken) => {
    this.setUserId(fbUserId);

    FB.api(
      "/oauth/access_token",
      {
        grant_type: "fb_exchange_token",
        client_id: FACEBOOK_APP_CLIENT_ID,
        client_secret: FACEBOOK_APP_CLIENT_SECRET,
        fb_exchange_token: loginToken,
      },
      this.getFacebookUserPagesList
    );
  };

  processLoginResponse = (response) => {
    if (response.authResponse) {
      var userId = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      //var grantedScopes = response.authResponse.grantedScopes;

      this.getFacebookUserRefreshAccessToken(userId, accessToken);
    } else {
      disableConfigurationAndDisableActiveConnection(
        this.connection_configuration_toggle_element,
        this.connection_selector,
        "You have cancelled facebook login"
      );
    }
  };

  showFacebookLogin = () => {
    FB.login(this.processLoginResponse, {
      scope:
        "public_profile,business_management,pages_show_list,read_insights,instagram_basic,instagram_content_publish",
      return_scopes: true,
    });
  };

  loginStatus = (response) => {
    if (response.status === "connected") {
      // The user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid0 access token, a signed
      // request, and the time the access token
      // and signed request each expire.
      this.processLoginResponse(response);
    } else if (response.status === "not_authorized") {
      // The user hasn't authorized your application.  They
      // must click the Login button, or you must call FB.login
      // in response to a user gesture, to launch a login dialog.
      this.showFacebookLogin();
    } else {
      // The user isn't logged in to Facebook. You can launch a
      // login dialog with a user gesture, but the user may have
      // to log in to Facebook before authorizing your application.
      this.showFacebookLogin();
    }
  };

  checkLoginStatus = () => {
    FB.getLoginStatus(this.loginStatus);
  };
}

class configureGoogleDriveConnectionClass {
  setData = (connection_configuration_toggle_element, connection_selector) => {
    this.connection_configuration_toggle_element =
      connection_configuration_toggle_element;
    this.connection_selector = connection_selector;
    this.AuthCode = null;
  };

  setUserId = (userId) => {
    this.userId = userId;
  };

  setAuthCode = (code) => {
    this.AuthCode = code;
  };

  checkLoginStatus = () => {
    gapi.load("client:auth2", this.initClient);
  };

  initClient = () => {
    gapi.auth2.init({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      api_key: GOOGLE_DRIVE_API_KEY,
    });

    showProcessingToast("Connecting to your Google Drive account ...");

    gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess({
        scope: "https://www.googleapis.com/auth/drive.file",
        //  prompt: 'none',
        access_type: "offline",
      })
      .then(this.authorizedUser, this.unAuthorizedUser);
  };

  authorizedUser = (authCode) => {
    showProcessingToast(
      "Connecting to Google Drive account for fetching channels"
    );

    this.setAuthCode(authCode.code);

    showSuccessMessageToast(
      "Google drive configured successfully, Please click Save/Update for saving the details"
    );

    $("#dam_credentials_google_drive").val(this.AuthCode);
  };

  unAuthorizedUser = (error) => {
    showErrorMessageToast("Google drive could not configure");
  };
}

class configureEmailConnectionClass {
  setData = (connection_configuration_toggle_element, connection_selector) => {
    this.connection_configuration_toggle_element =
      connection_configuration_toggle_element;
    this.connection_selector = connection_selector;
  };

  collectInformation = () => {
    var connection_name = this.connection_configuration_toggle_element.attr(
      "data-connection_setting_name"
    );

    Swal.fire({
      position: "center",
      title: "Provide Email Provider details",
      html:
        '<div class="text-center email_configuration">' +
        '<form class="needs-validation" action="' +
        ADMINS_AJAX_SOURCE +
        '" novalidate>\n' +
        '<input type="hidden" name="form_source" id="form_source" value="connection_configuration">\n' +
        '<input type="hidden" name="connection_type" id="connection_type" value="E-Mail">\n' +
        '<input type="hidden" name="connection_name" id="connection_name" value="' +
        connection_name +
        '">\n' +
        '<input type="hidden" name="connection_media_type" id="connection_media_type" value="' +
        this.connection_configuration_toggle_element.attr(
          "data-connection_media_type"
        ) +
        '">\n' +
        '<input type="hidden" name="connection_configuration_toggle_element" id="connection_configuration_toggle_element" value="#' +
        this.connection_configuration_toggle_element.attr("id") +
        '">\n' +
        '<input type="hidden" name="connection_selector" id="connection_selector" value="' +
        this.connection_selector +
        '">\n' +
        '<div class="row mt-2">\n' +
        '<div class="col-12">' +
        '<div class="form-group"> ' +
        '<label for="email_from_address" class="form-label">From Email</label>' +
        '<input type="email" class="form-control" name="email_from_address" id="email_api_key" placeholder="From Email" value="">' +
        "            </div>" +
        '<div class="form-group"> ' +
        '<label for="email_api_key" class="form-label">API Key</label>' +
        '<input type="text" class="form-control" name="email_api_key" id="email_api_key" placeholder="API Key for sending emails" value="">' +
        "            </div>" +
        "</div>" +
        "</div>" +
        '\t\t\t\t<div class="row mt-3">\n' +
        '\t\t\t\t\t<div class="text-center">\n' +
        '\t\t\t\t\t\t<button class="btn btn-min btn-success" type="submit">Confirm</button>\n' +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t</div>" +
        "</form>" +
        "</div>",
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      buttonsStyling: false,
      reverseButtons: false,
      confirmButtonText: "Confirm",
      focusConfirm: false,
      allowEscapeKey: true,
      allowOutsideClick: false,
      showLoaderOnConfirm: false,
      // closeOnConfirm: false,
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOutDown",
      },
      didOpen: () => {
        enableBootstrapValidator();
      },
    });
  };
}

function checkLeads(source) {
  checkboxes = document.getElementsByName("lead");
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
}

function broadcastLead() {
  var checkboxes = document.getElementsByName("lead");
  var isLeadChecked = [];

  for (var i = 0, n = checkboxes.length; i < n; i++) {
    if (checkboxes[i].checked) {
      if (checkboxes[i].value != "all") {
        if (checkboxes[i].value.split("_")[1] != 0) {
          isLeadChecked.push(checkboxes[i].value.split("_")[0]);
        }
      }
    }
  }

  if (isLeadChecked.length > 0) {
    window.location.href =
      "/leads/broadcast/?leads=" + JSON.stringify(isLeadChecked);
  } else {
    showErrorMessageToast("Select atleast one lead to broadcast", "Error", {
      positionClass: "toast-top-right",
    });
  }
}

$(function () {
  $(".publish_video_as").change(function () {
    if ($(this).prop("checked")) {
      $(this).val("Video");
      $(".shorts_warning_note").hide();
    } else {
      $(this).val("Shorts");
      $(".shorts_warning_note").show();
    }
  });

  $(".date-picker").datetimepicker({
    timepicker: false,
    format: "d-m-Y",
    // minDate: 0,//yesterday is minimum date(for today use 0 or -1970/01/01)
    onSelectDate: function (dp, $input) {
      // var formattedDate = new Date(dp);
      // var d = formattedDate.getDate();
      // var m =  formattedDate.getMonth();
      // m += 1;
      // var y = formattedDate.getFullYear();
      // let dateAfterFormat = d + "-" + m + "-" + y;
      // var currentUrl = window.location.href;
      // var url = new URL(currentUrl);
      // url.searchParams.set($input.attr('name'), dateAfterFormat);
      // var newUrl = url.href;
      // window.location.href = newUrl
    },
  });

  $(".wa_campaign_type").change(function () {
    if ($(this).find(":selected").val() != "") {
      var waLeadId = $(this).find(":selected").val();
      var formSource = $(".wa_leads_form_source").val();
      var inputData = {
        ajax_source: formSource,
        from_ajax: true,
        form_source: "whatsappLeadsData",
        wa_lead_id: waLeadId,
      };

      $.ajax({
        url: inputData["ajax_source"],
        type: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(inputData),
        success: function (responseData) {
          $(".total_msg_section").removeClass("d-none");
          $(".no_msg_section").addClass("d-none");
          ajaxSuccessResponse(responseData, "", inputData);
        },
        error: function (error) {
          ajaxFailedResponse(error, "", inputData);
        },
      });
    } else {
      $(".total_msg_section").addClass("d-none");
      $(".no_msg_section").removeClass("d-none");
    }
  });

  // $(".wa_campaign_type").change();

  $(".wa_analysis_duration").change(function () {
    // var currentUrl = window.location.href;
    // var url = new URL(currentUrl);
    // if($(this).find(":selected").val()) {
    //     url.searchParams.set('duration', $(this).find(":selected").val());
    // } else {
    //     url.searchParams.delete('duration', $(this).find(":selected").val());
    // }
    // var newUrl = url.href;
    // window.location.href = newUrl
  });
  $(".wa_analysis_type").change(function () {
    if ($(this).find(":selected").val() === "OUTGOING") {
      let newUrl = window.location.href.replace("incoming", "outgoing");
      if (newUrl.endsWith('/')) {
        newUrl = newUrl.slice(0, -1)
      }    
      newUrl = newUrl.replace(/\/[^\/]*$/, "/WhatsApp");
      window.location.href = newUrl;
    } else {
      let newUrl = window.location.href.replace("outgoing", "incoming");
      if (newUrl.endsWith('/')) {
        newUrl = newUrl.slice(0, -1)
      }   
      window.location.href = newUrl;
    }
  });
  $(".wa_analysis_filter_by").change(function () {
    var url = window.location.href;
    var to = url.lastIndexOf("/");
    if (to + 1 == url.length) {
      url = url.slice(0, url.lastIndexOf("/"));
    }
    url = url.replace(/\/[^\/]*$/, "/" + $(this).find(":selected").val());
    window.location.href = url;
  });
  // $("#socialInbox").DataTable({
  //   pageLength: 10,
  //   lengthMenu: [10, 30, 50, 100],
  //   pageLength: 10,
  //   paging: true,
  //   lengthChange: true,
  //   searching: false,
  //   ordering: true,
  //   info: true,
  //   autoWidth: false,
  // });
  var formSource = $(".form_action").val();
  var inbox_type = $(".type").val();
  var filter_by = $(".filter_by").val();
  var page = 1;
  
  var inputData = {
    ajax_source: formSource,
    from_ajax: true,
    form_source: "getSocialInboxData",
    inbox_type,
    filterBy: filter_by,
    page:$('.page').val(),
    draw:$('.page').val(),
  };

  const formData = new FormData();
  formData.append("org_id", 'ed69c24-4f60-4503-a3a0-1145ece45a5d');
  formData.append("type", 'OUTGOING');
  formData.append("filterBy", 'all');
  var options = { year: 'numeric', month: 'short', day: 'numeric' };

  
 var socialInboxDataTable = $("#socialInbox").DataTable({
    "pagingType": "full_numbers",
    ajax: {
      url: inputData["ajax_source"], //baseUrl+"/api/v1/getSocialInbox?page=1", //
      type: 'POST',
      // headers: {
      // 'Authorization': "Basic cHJvbXVsZ2F0ZTpwcm9tdWxnYXRl"
      // },
      // body: formData,
    //   data: function (d, re) {
    //     console.log(re);
    //     // console.log(re.oInstance._fnPageChange());
    //     // re.oInstance._fnPageChange = (a,b,c) => {
    //     //   console.log('a', a,b,c);
    //     // }
    //     // if (d.order[0].dir == "asc") {
    //     //   inputData.draw = d.draw;
    //     // } else {
    //     //   inputData.draw = d.draw - 1;
    //     // }

    //     if(document.getElementsByClassName('paginate_button active') && document.getElementsByClassName('paginate_button active')[0]) {
    //       console.log(document.getElementsByClassName('paginate_button active'));

    //       inputData.draw = document.getElementsByClassName('paginate_button active')[0].value;
    //       inputData.page = document.getElementsByClassName('paginate_button active')[0].value;
    //     } else {
    //       inputData.draw = 1;
    //     }
    //     console.log('d', d, inputData)
        
    //     //d.extra_search = $('#extra').val();
    //   //  inputData.draw = d.draw;
    //     return inputData
    // },
      data: inputData,
     // dataType: "json",
      
     // contentType: "application/json; charset=UTF-8",
      // data: {
      //   'orgId': 'ed69c24-4f60-4503-a3a0-1145-ece45a5d',
      //   'startDate': '',
      //   'endDate': '',
      //   'duration': '',
      //   'type': 'INCOMING',
      //   'filterBy': 'all'
      // },
      //inputData, //JSON.stringify(inputData),
    //   dataSrc: function (d) {
    //     // Format API response for DataTables
    //     var response = d;
    //     if (typeof d.response != 'undefined') {
    //         response = d.response;
    //     }
    //     console.log(JSON.stringify(response)); // Output from this is below...
    //     return response;
    // },

      dataFilter: function(data){
        var json = jQuery.parseJSON( data );
        json.recordsTotal = json.recordsTotal;
        json.recordsFiltered = json.recordsFiltered;
        json.data = json.data;
        return JSON.stringify( json.pop() );
    },
    // "success" : function(data){
    //   console.log('data', data);
    //     str = JSON.stringify(data).data;
    //     str = JSON.stringify(data.data, null, 4);
    //     $('tbody').empty();
    //     $.each(JSON.parse(str), function (i, result) {
    //         $('tbody').append(
    //             '<tr>' +
    //             '<td>' + result[0] + '</td>' +
    //             '<td>' + result.name + '</td>' +
    //             '<td>' + result.age + '</td>' +
    //             '<td>' + result.created_at + '</td>' +
    //             '<td>' + result.other_info + '</td>' +

    //             '<td>' + result.message + '</td>' +

    //             '</tr>'
    //         )
    //     });

    // },
      // success: function (responseData) {
      //   console.log('responseData', responseData);
      // },
      // error: function (error) {
      //   console.log('err', error);
      // },
    },
    createdRow: function( row, data, dataIndex ) {
      // Set the data-status attribute, and add a class
      $( row ).find('td:eq(0)')
          //.attr('data-status', data.status ? 'locked' : 'unlocked')
          .addClass('text-center');
  },
    columns: [
      {data: "channelName" , render : function ( data, type, row, meta ) {
        if (data === 'WhatsApp') {
          return '<i class="fa fa-'+data.toLowerCase()+'  fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else if (data === 'Instagram') {
          return '<i class="fa fa-'+data.toLowerCase()+'  fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else if (data === 'Youtube') {
          return '<i class="fa fa-'+data.toLowerCase()+'  fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else if (data === 'Facebook') {
          return '<i class="fa fa-'+data.toLowerCase()+'  fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else if (data === 'LinkedIn') {
          return '<i class="fa fa-'+data.toLowerCase()+'  fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else if (data === 'Website') {
          return '<i class="fa fa-globe fa-2x social_inbox_channel_icon" aria-hidden="true"></i>'
        } else {
          return data;
        }
        
      }},
      { data: 'channelId' },
      {data: "sentTo" , render : function ( data, type, row, meta ) {
        return row.messageType == "OUTGOING" ? 'To: +'+data : 'From: '+data;
      }},
      { 
        data: "message", 
        render: function(data, type, row, meta) {
            const maxLength = 25; // You can adjust the maximum length of the visible message
            const truncatedMessage = data.length > maxLength ? data.substring(0, maxLength) + "..." : data;
            return `
                <p title="${data}" onclick="showMsgDetails(this)" class="msg_body" data-msg="${data}">
                    ${truncatedMessage}
                </p>
            `;
        }
    },
      {data: "message" , render : function ( data, type, row, meta ) {
        return `
          <input data-bootstrap-switch type="checkbox" name="readInboxId[]"
            data-toggle="toggle" data-onstyle="success" data-offstyle="light"
            data-on="Sent" data-off="Not sent" data-size="small" class="" />`
      }},
      {data: "message" , render : function ( data, type, row, meta ) {
        return `
          <input data-bootstrap-switch type="checkbox" name="readInboxId[]"
            data-toggle="toggle" data-onstyle="success" data-offstyle="light"
            data-on="Closed" data-off="Open" data-size="small" class="readInboxChange"
            data-id="${row.socialInboxID}" value="${row.isRead}" ${row.isRead == 1 ? 'checked disabled' : ''} />`
      }},
      {data: "createdAt" , render : function ( data, type, row, meta ) {
        var dt  = new Date(row.createdAt);
        return dt.toLocaleDateString("en-US", options)
      }}      
  ],
  "fnDrawCallback": function() {
    $("input[data-bootstrap-switch]").each(function () {
      $(this).bootstrapToggle("state", $(this).prop("checked"));
    });
    $(".readInboxChange").change(function () {
      markAsReadSocialInbox(
        $(this).attr("data-id"),
        $(this).is(":checked") ? 1 : 0
      );
    });
  },
  // "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) { 
  //   console.log(nRow, aData);               
  //     if ( aData[3] != aData[4]){
  //         jQuery(nRow).addClass('red');
  //     }               
  // },
  //   columns: [
  //     { data: 'first_name' },
  //     { data: 'last_name' },
  //     { data: 'position' },
  //     { data: 'office' },
  //     { data: 'start_date' },
  //     { data: 'salary' }
  // ],
  //   columnDefs: [
  //     {
  //         // The `data` parameter refers to the data for the cell (defined by the
  //         // `data` option, which defaults to the column being worked with, in
  //         // this case `data: 0`.
  //         render: (data, type, row) => data + ' (' + row[3] + ')',
  //         targets: 0
  //     },
  //     { visible: false, targets: [3] }
  // ],
    // "columns": [
    //     { "data": "channelName" },
    //     { "data": "channelId" },
    //     { "data": "channelName" },
    //     { "data": "updatedAt" },
    //     { "data": "sentTo" },
    //     { "data": "postID" },
        
    // ],
    // columns: [
    //   {
    //       data: 'socialInboxID'
    //   },
    //   {
    //       data: 'channelName',
    //       render: function (data, type) {
    //         console.log(data, type);
    //           if (type === 'display') {
    //               let link = 'https://datatables.net';

    //               if (data[0] < 'H') {
    //                   link = 'https://cloudtables.com';
    //               }
    //               else if (data[0] < 'S') {
    //                   link = 'https://editor.datatables.net';
    //               }

    //               return '<a href="' + link + '">' + data + '</a>';
    //           }

    //           return data;
    //       }
    //   },
    //   {
    //       className: 'f32', // used by world-flags-sprite library
    //       data: 'office',
    //       render: function (data, type) {
    //           if (type === 'display') {
    //               let country = '';

    //               switch (data) {
    //                   case 'Argentina':
    //                       country = 'ar';
    //                       break;
    //                   case 'Edinburgh':
    //                       country = '_Scotland';
    //                       break;
    //                   case 'London':
    //                       country = '_England';
    //                       break;
    //                   case 'New York':
    //                   case 'San Francisco':
    //                       country = 'us';
    //                       break;
    //                   case 'Sydney':
    //                       country = 'au';
    //                       break;
    //                   case 'Tokyo':
    //                       country = 'jp';
    //                       break;
    //               }

    //               return '<span class="flag ' + country + '"></span> ' + data;
    //           }

    //           return data;
    //       }
    //   },
    //   {
    //       data: 'extn',
    //       render: function (data, type, row, meta) {
    //           return type === 'display'
    //               ? '<progress value="' + data + '" max="9999"></progress>'
    //               : data;
    //       }
    //   },
    //   {
    //       data: 'start_date'
    //   },
    //   {
    //       data: 'salary',
    //       render: function (data, type) {
    //           var number = DataTable.render
    //               .number(',', '.', 2, '$')
    //               .display(data);

    //           if (type === 'display') {
    //               let color = 'green';
    //               if (data < 250000) {
    //                   color = 'red';
    //               }
    //               else if (data < 500000) {
    //                   color = 'orange';
    //               }

    //               return `<span style="color:${color}">${number}</span>`;
    //           }

    //           return number;
    //       }
    //   }
    // ],
  processing: true,
  serverSide: true
})
socialInboxDataTable.on('page', function () {
  inputData.page = socialInboxDataTable.page.info().page;
});

function getPageNo() {
  console.log(socialInboxDataTable);
  return socialInboxDataTable?.page ? socialInboxDataTable?.page.info().page : 0;
}
// .on( 'xhr.dt', function (res) {
//   console.log(res);
// });

  $(".readInboxChange").change(function () {
    markAsReadSocialInbox(
      $(this).attr("data-id"),
      $(this).is(":checked") ? 1 : 0
    );
  });

  // $(".msg_body").click(function () {
  //   $(".modal_body_msg").html($(this).data("msg"));
  //   $("#msgPreviewModal").modal("toggle");
  // });

  $(".hide_modal").click(function () {
    $("#msgPreviewModal").modal("toggle");
  });
});

showMsgDetails = (that) => {
  $(".modal_body_msg").html($(that).data("msg"));
  $("#msgPreviewModal").modal("toggle");
};

$(".paid_amt_txt").blur(function () {
  var amtFor = $(this).attr('data-amt_for');
  var amt = parseInt($(this).val());
  var campaign_id = $(this).attr('data-campaign_id');
  var formSource = $(this).attr('data-form_action');
  var inputData = {
    ajax_source: formSource,
    from_ajax: true,
    form_source: "saveCampaignAnalyticsPaidValues",
    campaign_id,
    amt,
    amtFor
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
});

$('.generate_report').click(function() {
  $('.generate_report').hide();
  window.print();
})
window.addEventListener('afterprint', () => {
  $('.generate_report').show();
});

$(".refreshSocialMediaCron").click(function () {
  var formSource = $(".form_action").val();
  var inputData = {
    ajax_source: formSource,
    from_ajax: true,
    form_source: "manuallyRunSocialMediaCron"
  };

  $.ajax({
    url: inputData["ajax_source"],
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      responseData.data.message += ' Page will auto refresh in 2 mins.';
      ajaxSuccessResponse(responseData, "", inputData);
      setTimeout(() => {
        window.location.reload();
      },120000)
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
});

$(".deleteAccount").click(function () {
  var html = "<br /><button type='button' class='btn do_action'>Yes</button><button type='button' class='btn no_action'>No</button>";
   toastr.info(html,'Are you sure to delete this account?',
      {
        allowHtml: true,
        timeOut: 50000,
        tapToDismiss: true,
        extendedTimeOut: 100000,
        onShown: function (toast) {
          $(".do_action").click(function(){
              deleteUserAcc();
            });
          $(".no_action").click(function(){
              //console.log('clicked no_action');
            });
        }
      });
});

deleteUserAcc = () => {
  var inputData = {
    ajax_source: "lead/ajax",
    from_ajax: true,
    form_source: "delete_user"
  };
  showProcessingToast();

  $.ajax({
    url: "/leads/ajax",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      ajaxSuccessResponse(responseData, "", inputData);
    },
    error: function (error) {
      ajaxFailedResponse(error, "", inputData);
    },
  });
};

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.paid_amt_txt').forEach(input => {
    const span = document.createElement('span');
    span.textContent = `${input.value}`;
    span.className = 'paid_amt_txt_print';
    input.parentNode.replaceChild(span, input);
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('.paid_amt_txt_print').forEach(span => {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.placeholder = 'eg 500';
    input.className = 'form-control paid_amt_txt';
    input.value = span.textContent.replace('Rs. ', '');
    input.title = 'Enter the amount in rupees and press tab or click outside to save';
    span.parentNode.replaceChild(input, span);
  });
});

// JavaScript to open the modal and populate the data
document.addEventListener('DOMContentLoaded', function () {

  const editemployeeButtons = document.querySelectorAll('.edit-employee-btn');
  editemployeeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const userId = this.getAttribute('userid');
      const agencyId = this.getAttribute('agencyid');
      const firstName = this.closest('tr').querySelector('td:nth-child(1)').textContent;
      const lastName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      const userName = this.closest('tr').querySelector('td:nth-child(3)').textContent;
      const email = this.closest('tr').querySelector('td:nth-child(4)').textContent;
      const userStatus = this.closest('tr').querySelector('td:nth-child(5)').textContent.trim().toLowerCase();
      
      // Set the values in the modal
      document.getElementById('emplyUserId').value = userId;
      document.getElementById('emplyAgencyId').value = agencyId;
      document.getElementById('emplyFirstName').value = firstName;
      document.getElementById('emplyLastName').value = lastName;
      document.getElementById('emplyUserName').value = userName;
      document.getElementById('emplyEmail').value = email;
      document.getElementById('emplyStatus').value = userStatus;
    });
  });

  const editButtons = document.querySelectorAll('.edit-btn');
  
  editButtons.forEach(button => {
    button.addEventListener('click', function () {
      const userId = this.getAttribute('data-userid');
      const agencyId = this.getAttribute('data-agencyid');
      const firstName = this.closest('tr').querySelector('td:nth-child(1)').textContent;
      const lastName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      const userName = this.closest('tr').querySelector('td:nth-child(3)').textContent;
      const email = this.closest('tr').querySelector('td:nth-child(4)').textContent;
      const userStatus = this.closest('tr').querySelector('td:nth-child(5)').textContent.trim().toLowerCase();

      // Set the values in the modal
      document.getElementById('modalUserId').value = userId;
      document.getElementById('modalAgencyId').value = agencyId;
      document.getElementById('editFirstName').value = firstName;
      document.getElementById('editLastName').value = lastName;
      document.getElementById('editUserName').value = userName;
      document.getElementById('editEmail').value = email;
      document.getElementById('editStatus').value = userStatus;
    });
  });

  const editagencyButtons = document.querySelectorAll(".edit-agency-btn");

  editagencyButtons.forEach((buttons) => {
    buttons.addEventListener("click", function () {
      const agencyId = this.getAttribute("data-agencyId");
      const name = this.closest('tr').querySelector('td:nth-child(1)').textContent;
      const email = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      const description = this.closest('tr').querySelector('td:nth-child(3)').textContent;

      // Populate modal fields
      document.getElementById("magencyId").value = agencyId;
      document.getElementById("agencyName").value = name;
      document.getElementById("agencyEmail").value = email;
      document.getElementById("agencyDescription").value = description;
    });
  });

  const editAgencyEmployee=document.getElementById('editAgencyEmployee')
  const editEmployeeForm = document.getElementById('editEmployeeForm');
  const editAgencyForm = document.getElementById('editAgencyForm');

  if (editAgencyEmployee) {
    editAgencyEmployee.addEventListener('submit', function (event) {
      event.preventDefault();

      const userId = document.getElementById('emplyUserId').value;
      const agencyId = document.getElementById('emplyAgencyId').value;
      const firstName = document.getElementById('emplyFirstName').value;
      const lastName = document.getElementById('emplyLastName').value;
      const userName = document.getElementById('emplyUserName').value;
      const email = document.getElementById('emplyEmail').value;
      const userStatus = document.getElementById('emplyStatus').value;

      var inputData = {
        ajax_source: "agency/ajax",
        from_ajax: true,
        form_source: "updateAgencyEmployee",
        userId: userId,
        agencyId: agencyId,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        userStatus: userStatus,
      };

      $.ajax({
        url: "/agency/ajax",
        type: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(inputData),
        success: function (responseData) {
          ajaxSuccessResponse(responseData, "employee", inputData);
        },
        error: function (error) {
          ajaxFailedResponse(error, "employee", inputData);
        },
      });
    });
  }

  if (editEmployeeForm) {
    editEmployeeForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const userId = document.getElementById('modalUserId').value;
      const agencyId = document.getElementById('modalAgencyId').value;
      const firstName = document.getElementById('editFirstName').value;
      const lastName = document.getElementById('editLastName').value;
      const userName = document.getElementById('editUserName').value;
      const email = document.getElementById('editEmail').value;
      const userStatus = document.getElementById('editStatus').value;

      var inputData = {
        ajax_source: "super/ajax",
        from_ajax: true,
        form_source: "updateEmployeeDetails",
        userId: userId,
        agencyId: agencyId,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        userStatus: userStatus,
      };

      $.ajax({
        url: "/super/ajax",
        type: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(inputData),
        success: function (responseData) {
          ajaxSuccessResponse(responseData, "employee", inputData);
        },
        error: function (error) {
          ajaxFailedResponse(error, "employee", inputData);
        },
      });
    });
  }

  if (editAgencyForm) {
    editAgencyForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const magencyId = document.getElementById('magencyId').value;
      const name = document.getElementById('agencyName').value;
      const memail = document.getElementById('agencyEmail').value;
      const description = document.getElementById('agencyDescription').value;

      var inputData = {
        ajax_source: "super/ajax",
        from_ajax: true,
        form_source: "updatedAgencyDetails",
        agencyId: magencyId,
        name: name,
        email: memail,
        description: description,
      };

      $.ajax({
        url: "/super/ajax",
        type: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(inputData),
        success: function (responseData) {
          ajaxSuccessResponse(responseData, "agency", inputData);
        },
        error: function (error) {
          ajaxFailedResponse(error, "agency", inputData);
        },
      });
    });
  }
});

$(".deleteUser").click(function () {
  const userId = $(this).data('user-id');
  const agencyId = $(this).data('agency-id');
  // const email = $(this).data('email');

  // Log the values to check if email is correct
  console.log("User ID:", userId, "Agency ID:", agencyId);

  const confirmationHtml = `
    <br />
    <button type='button' class='btn do_action'>Yes</button>
    <button type='button' class='btn no_action'>No</button>
  `;

  toastr.info(confirmationHtml, 'Are you sure you want to delete this employee?', {
    allowHtml: true,
    timeOut: 50000,
    tapToDismiss: true,
    extendedTimeOut: 100000,
    onShown: function (toast) {
      $(".do_action").click(function () {
        if (!userId || !agencyId) {
          toastr.error("Invalid data: User ID or Agency ID missing.");
          return;
        }
        deleteAgencyEmployee(userId, agencyId);
      });

      $(".no_action").click(function () {
        toastr.clear();
      });
    },
  });
});

deleteAgencyEmployee = (userId, agencyId) => {
  const inputData = {
    ajax_source: "agency/ajax",
    from_ajax: true,
    form_source: "deleteAgencyEmployee",
    userId: userId,
    agencyId: agencyId,
    // email: email // Include email in the data being sent
  };

  console.log("Input Data:", inputData); // Debug log for AJAX data

  showProcessingToast();

  $.ajax({
    url: "/agency/ajax",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify(inputData),
    success: function (responseData) {
      console.log("Response Data:", responseData); // Debug log for success response

      if (responseData.success) {
        toastr.success(responseData.message || 'Employee deleted successfully.');
        $(`[data-user-id="${userId}"][data-agency-id="${agencyId}"]`).closest('tr').remove();
        window.location.reload();
      } else {
        toastr.error(responseData.message || 'Failed to delete the employee.');
      }
    },
    error: function (error) {
      console.error("AJAX Error:", error); // Debug log for AJAX error
      toastr.error('An error occurred while deleting the employee.');
    },
  });
};
