'use strict'

const ciWidgetSelector = $('div.js-ci-widget')
const ciWidgetContentSelector = $('div.js-ci-widget .ci-widget-content')
const branchName = $('span.js-source-branch').attr('data-original-title')

function addPipelineButton() {
    if (branchName !== 'undefined') {
        let link = 'http://jenkins.simplicity.ag/blue/organizations/jenkins/spryker-simplicity/activity?branch=' + branchName
        addCiButton(link, 'Open Jenkins')
    }
}

function addEnvironmentButton() {
    if (branchName !== 'undefined') {
        let link = 'http://' + branchName + '.simplicity-development.de'
        addCiButton(link, 'Open Environment')
    }
}

function addCiButton(link, buttonText) {
    if (ciWidgetContentSelector.length) {
        ciWidgetContentSelector.append(getCiWidgetButton(link, buttonText))
    }
    // Pipeline is still syncing with Jenkins
    else if (ciWidgetSelector.length) {
        ciWidgetSelector.append(getCiWidgetButton(link, buttonText))
    }
}

function getCiWidgetButton(link, title) {
    return `<a href="${link}" data-placement="bottom" tabindex="0" role="button" class="btn btn-default d-none d-md-inline-block append-right-8" target="_blank">
              ${title}
            </a>`
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
                    addEnvironmentButton()
                }
            }
        }
    })
}

getSettingsAndStart()
