/*jslint nomen: true, plusplus: true, todo: true, white: true, browser: true, indent: 2 */

jQuery(function($) {
  'use strict';

  var killProcess = function() {
    $('#behat-ui-kill').click(function() {
      $.ajax({
        url: Drupal.settings.basePath + 'behat-ui/kill?' + parseInt(Math.random() * 1000000000, 10),
        dataType: 'json',
        success: function (data) {
          if (data.response) {
            console.log(Drupal.t('Process killed'));
            checkStatus();
          } else {
            console.log(Drupal.t('Could not kill process'));
          }
        },
        error: function (xhr, textStatus, error) {
          console.log(Drupal.t('An error happened on trying to kill the process.'));
        }
      });
      return false;
    });
  };

  var checkStatus = function() { 
    var $stat = $('#behat-ui-status'),
        $output = $('#behat-ui-output');

    $.ajax({
      url: Drupal.settings.basePath + 'behat-ui/status?' + parseInt(Math.random() * 1000000000, 10),
      dataType: 'json',
      success: function (data) {
        $stat.removeClass('running');

        if (data.running) {
          $stat.addClass('running');
          $stat.find('span').html(Drupal.t('Running <small><a href="#" id="behat-ui-kill">(kill)</a></small>'));
          killProcess();
          setTimeout(checkStatus, 10000);
        } else {
          var download = ' <a href="' + Drupal.settings.basePath + 'behat-ui/download/html" class="download">' + Drupal.t('Download output as HTML') + '</a>' +
                         ' <a href="' + Drupal.settings.basePath + 'behat-ui/download/txt" class="download">' + Drupal.t('Download output as plain text') + '</a>';
          if (!data.output) {
            download = '';
          }
          $stat.find('span').html(Drupal.t('Not running') + download);
        }

        $output.html(data.output);
        $output[0].scrollTop = $output[0].scrollHeight;
      },
      error: function (xhr, textStatus, error) {
        console.log(Drupal.t('An error happened on checking tests status.'));
        setTimeout(checkStatus, 10000);
      }
    });
  }
  checkStatus();
  killProcess();
});
