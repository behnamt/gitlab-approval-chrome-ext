'use strict'

function addPipelineButton() {
    let branchName = $('span.js-source-branch').attr('data-original-title')

    if (branchName !== 'undefined') {
        let link = 'http://jenkins.simplicity.ag/blue/organizations/jenkins/spryker-simplicity/activity?branch=' + branchName
        $('div.js-ci-widget .ci-widget-content').append(`
            <a href="${link}" data-placement="bottom" tabindex="0" role="button" class="btn btn-default d-none d-md-inline-block append-right-8" target="_blank">
              Open Jenkins
            </a>
        `)
    }
}

function addQaLinksButton() {
    let branchName = $('span.js-source-branch').attr('data-original-title')

    if (branchName !== 'undefined') {
        let link = 'http://' + branchName + '.simplicity-development.de'

        $('div.js-ci-widget .ci-widget-content').append(`
            <a href="${link}" data-placement="bottom" tabindex="0" role="button" class="btn btn-default d-none d-md-inline-block append-right-8" target="_blank">
              Open Environment
            </a>
        `)
    }
}

/*
 * Loads up the settings, and then begins pulling in the merge request approval info.
 */
function getSettingsAndStart() {
    chrome.storage.local.get(null, function (settings) {
        // Begin parsing and injecting views
        if (window.location.href.indexOf('spryker-simplicity') !== -1) {
            if (window.location.href.indexOf('merge_requests') !== -1) {
                if ($.isNumeric(window.location.pathname.split('/')[4])) {
                    addPipelineButton()
                    addQaLinksButton()
                }
            }
        }
    })
}

getSettingsAndStart()
