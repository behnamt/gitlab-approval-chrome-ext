'use-strict'

/*
 * Loads up the settings, and then begins pulling in the merge request approval info.
 */
function getSettingsAndStart () {
    chrome.storage.local.get(null, function (settings) {
        if (!isNaN(settings['compact-approval'])) {
            compactApprovals = settings['compact-approval']
        }
        if (!isNaN(settings['author'])) {
            authorEnabled = settings['author']
        }

        // Begin parsing and injecting views
        if (window.location.href.indexOf('merge_requests') !== -1) {
            if (window.location.href.indexOf('groups') !== -1) {
                // Get all merge requests for a group view
                if (checkForNewProjects(settings)) {
                    getGroupProjectIds(getGroupId())
                        .then(function (groupInformation) {
                            groupInformation.projects.forEach(function (project) {
                                if (!(project.path_with_namespace in settings)) {
                                    cacheProjectId(project.path_with_namespace, project.id)
                                }
                            })
                        }).then(function () {
                        parseMergeRequestsOnPage(null)
                    })
                } else {
                    // No need to fetch; we have all the required project ids
                    parseMergeRequestsOnPage(null)
                }
            }
            // When on a new MR
            else if (window.location.href.indexOf('new') !== -1) {
                // Auto-check remove branch checkbox if setting is enabled
                if (!isNaN(settings['auto-select-force-remove'])) {
                    $('#merge_request_force_remove_source_branch').prop('checked', settings['auto-select-force-remove'])
                }
            }
            // When viewing an MR
            else if ($.isNumeric(window.location.pathname.split('/')[4])) {
                addAssignMyselfAsApproverButton(!isNaN(settings['api-key']) ? settings['api-key'] : false)
            }
            // When on MR listing
            else {
                // Get all merge requests for a project view
                parseMergeRequestsOnPage(getProjectId())
                addBlockMergesToDevelop(!isNaN(settings['api-key']) ? settings['api-key'] : false)
            }
        }
    })
}

// Begin running
getSettingsAndStart()
