'use strict'

const approverWidgetSelector = $('div.js-mr-approvals')

var current_approvers = [];
var current_approver_groups = [];
var userId = '';
var userCanApprove = false;

function getCurrentUserId() {
    return getCurrentUser()
        .then(function (user) {
            userId = user.id;
        });
}

function getCurrentApprovals() {
    let mergeRequestId = window.location.pathname.split('/')[4];
    let projectId = getProjectId()
    return getApprovals(projectId, mergeRequestId)
        .then(function (mergeRequest) {
            current_approvers = mergeRequest.approvers.map(approver => approver.user.id)
            current_approver_groups = mergeRequest.approver_groups.map(approver_group => approver_group.group.id)
            userCanApprove = mergeRequest.user_can_approve
        })
}

function addAssignMyselfAsApproverButton(apiKey) {
    if (apiKey) {
        showButton(apiKey)
    } else {
        approverWidgetSelector.append(`
            <div class="no-api-key-warning" title="you did not assign an API key to the extension. Open extension's option and follow the instructions">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="question" class="no-api-key-warning__icon"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm-.778-5.151h1.955c.004-.178.02-.341.044-.49.025-.147.064-.284.116-.41.053-.125.123-.244.212-.358.09-.114.2-.23.332-.349.228-.21.442-.409.642-.598a4.4 4.4 0 0 0 .523-.584 2.55 2.55 0 0 0 .349-.65c.084-.232.126-.497.126-.793a2.92 2.92 0 0 0-.218-1.169 2.23 2.23 0 0 0-.633-.847 2.795 2.795 0 0 0-1.008-.517 4.761 4.761 0 0 0-1.34-.174c-.45 0-.872.055-1.264.164-.392.11-.733.282-1.022.516a2.49 2.49 0 0 0-.69.9c-.172.364-.26.801-.264 1.312h2.31a1.5 1.5 0 0 1 .09-.506 1.04 1.04 0 0 1 .208-.345.806.806 0 0 1 .29-.199.92.92 0 0 1 .342-.064c.296 0 .519.083.667.249.148.166.222.427.222.783 0 .287-.092.551-.277.793a4.81 4.81 0 0 1-.755.758c-.187.16-.342.327-.465.503a2.356 2.356 0 0 0-.294.574 3.2 3.2 0 0 0-.154.68c-.03.246-.044.52-.044.82zm-.28 2.078c0 .164.03.316.092.458.061.141.149.263.263.365.114.103.248.184.403.243.155.06.328.089.52.089.191 0 .364-.03.52-.089.154-.06.289-.14.403-.243a1.05 1.05 0 0 0 .263-.365c.061-.142.092-.294.092-.458 0-.164-.03-.317-.092-.458a1.05 1.05 0 0 0-.263-.366 1.278 1.278 0 0 0-.404-.243 1.445 1.445 0 0 0-.52-.089c-.19 0-.364.03-.519.09a1.27 1.27 0 0 0-.403.242 1.05 1.05 0 0 0-.263.366 1.135 1.135 0 0 0-.093.458z"></path></svg>
            </div>
        `);
    }
}

async function showButton(apiKey) {
    await getCurrentUserId();
    await getCurrentApprovals();

    if (!userCanApprove) {
        return;
    }
    if (current_approvers.includes(userId)){
        approverWidgetSelector.append(`
            <div class="flex-grow">
                <button type="button" id="addAsApprover" class="btn btn-danger btn-inverted btn-sm float-right">
                    <span class="text-3">&minus;</span>
                    Unassign myself as approver
                </button>
             </div> 
        `);
        $("#addAsApprover").click(function() {
            removeCurrentUserAsApprover(apiKey);
        })
    } else {
        approverWidgetSelector.append(`
            <div class="flex-grow">
                <button type="button" id="addAsApprover" class="btn btn-success btn-inverted btn-sm float-right">
                    <span class="text-3">&#43;</span>
                    Assign myself as approver
                </button>
             </div> 
        `);
        $("#addAsApprover").click(function() {
            addCurrentUserAsApprover(apiKey);
        })
    }
}

function addCurrentUserAsApprover(apiKey) {
    let projectId = getProjectId();
    let mergeRequestId = window.location.pathname.split('/')[4];
    current_approvers.push(userId)
    putUserAsApprover(apiKey, projectId, mergeRequestId, current_approvers, current_approver_groups)
    window.location.reload()
}

function removeCurrentUserAsApprover(apiKey) {
    let projectId = getProjectId();
    let mergeRequestId = window.location.pathname.split('/')[4];
    current_approvers = current_approvers.filter(function(approverId) {
        return approverId !== userId;
    });
    putUserAsApprover(apiKey, projectId, mergeRequestId, current_approvers, current_approver_groups)
    window.location.reload()
}
