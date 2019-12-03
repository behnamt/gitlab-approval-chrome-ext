'use strict'

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';
var svcHost = 'https://' + (new URL(window.location.href).hostname) + '/api/v4';

/**
 * Fetch currently authenticated user
 * @return xhr response.
 */
function getCurrentUser() {
  return makeXhrRequest(
      HTTP_GET,
      `${svcHost}/user/`
  )
}

/**
 * @deprecated Deprecated by Gitlab on version 12.3 (actually completely non-functional now)
 *
 * Update approver list with current user
 * @param apiKey
 * @param projectId
 * @param mergeRequestId
 * @param approver_ids
 * @param approver_group_ids
 * @return xhr response.
 */
function putUserAsApprover(apiKey, projectId, mergeRequestId, approver_ids, approver_group_ids) {
  let approvers = approver_ids.map(id => `approver_ids[]=${id}`).join('&')
  if (approvers === '') {
    approvers = 'approver_ids[]'
  }
  let approver_groups = approver_group_ids.map(id => `approver_group_ids[]=${id}`).join('&')
  if (approver_groups === '') {
    approver_groups = 'approver_group_ids[]'
  }
  return makeXhrRequest(
    HTTP_PUT,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/approvers?private_token=${apiKey}&${approvers}&${approver_groups}`
  )
}

/**
 * Create a new approval rule for the MR with current user assigned
 *
 * @param apiKey
 * @param projectId
 * @param mergeRequestId
 * @param approver_ids
 * @param approvals_required
 * @return xhr response.
 */
function createDefaultApprovalRule(apiKey, projectId, mergeRequestId, approver_ids, approvals_required) {
  let approvers = approver_ids.map(id => `user_ids[]=${id}`).join('&');
  if (approvers === '') {
    approvers = 'user_ids[]';
  }
  return makeXhrRequest(
    HTTP_POST,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/approval_rules?private_token=${apiKey}&name=Default&approvals_required=${approvals_required}&${approvers}`
  )
}

/**
 * Update an existing approval rule for the MR with current user assigned
 *
 * @param apiKey
 * @param projectId
 * @param mergeRequestId
 * @param approver_ids
 * @param approvals_required
 * @return xhr response.
 */
function updateDefaultApprovalRule(apiKey, projectId, mergeRequestId, approvalRuleId, approver_ids, approvals_required) {
  let approvers = approver_ids.map(id => `user_ids[]=${id}`).join('&');
  if (approvers === '') {
    approvers = 'user_ids[]';
  }
  return makeXhrRequest(
    HTTP_PUT,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/approval_rules/${approvalRuleId}?private_token=${apiKey}&name=Default&approvals_required=${approvals_required}&${approvers}`
  )
}

/**
 * Fetches all approvals for a given Merge Request using its iid via an Xhr request.
 *
 * @param projectId
 * @param mergeRequestId the merge request iid.
 * @returns xhr response.
 */
function getApprovals (projectId, mergeRequestId) {
  console.log(`Fetching approvals... (MR iid: ${mergeRequestId})`)
  return makeXhrRequest(
    HTTP_GET,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/approvals/`
  )
}

/**
 * Fetches all approval rules for a given Merge Request using its iid via an Xhr request.
 *
 * @param projectId
 * @param mergeRequestId the merge request iid.
 * @returns xhr response.
 */
function getApprovalRules (projectId, mergeRequestId) {
  return makeXhrRequest(
    HTTP_GET,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/approval_rules/`
  );
}

/**
 * Fetches all emojis for a given Merge Request using its iid via an Xhr request.
 *
 * @param projectId
 * @param mergeRequestId the merge request iid.
 * @returns xhr response.
 */
function getAwardEmoji (projectId, mergeRequestId) {
  return makeXhrRequest(
    HTTP_GET,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
  )
}

/**
 * Fetch project's protected branches
 * @param apiKey
 * @param projectId
 * @param branchName
 * @return {xhr}
 */
function getProtectedBranch(apiKey, projectId, branchName) {
  return makeXhrRequest(
      HTTP_GET,
      `${svcHost}/projects/${projectId}/protected_branches/${branchName}?private_token=${apiKey}`
  )
}

/**
 * Delete a protected branch (make it unprotected)
 * @param apiKey
 * @param projectId
 * @param branchName
 * @return {xhr}
 */
function unprotectBranch(apiKey, projectId, branchName) {
  return makeXhrRequest(
      HTTP_DELETE,
      `${svcHost}/projects/${projectId}/protected_branches/${branchName}?private_token=${apiKey}`
  )
}

/**
 * Add a new protected branch
 * @param apiKey
 * @param projectId
 * @param branchName
 * @param accessLevels {push, merge, unprotect}
 * @return {xhr}
 */
function protectBranch(apiKey, projectId, branchName, accessLevels) {
  return makeXhrRequest(
      HTTP_POST,
      `${svcHost}/projects/${projectId}/protected_branches?private_token=${apiKey}&name=${branchName}&push_access_level=${accessLevels.push}&merge_access_level=${accessLevels.merge}&unprotect_access_level=${accessLevels.unprotect}`
  )
}

/**
 * Fetches all project Ids for a given group via an Xhr request.
 * @param {Integer} groupId the group id.
 * @returns xhr response.
 */
function getGroupProjectIds (groupId) {
  console.log(`Fetching project ids... (Group id: ${groupId})`)
  return makeXhrRequest(
    HTTP_GET,
    `${svcHost}/groups/${groupId}/`
  )
}

/**
 * Make a URL request using Xhr.
 * @param {String} method the method type of the request (eg. GET, POST, etc)
 * @param {String} url the url to make a request against.
 * @returns xhr response.
 */
function makeXhrRequest (method, url) {
  return new Promise((resolve, reject) => {
    // Setup the request
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    // When the function loads
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(xhr.response === "" ? {} : JSON.parse(xhr.response))
      } else {
        reject(Error(JSON.stringify({
          status: xhr.status,
          statusTextInElse: xhr.statusText
        })))
      }
    };

    // Error handling
    xhr.onerror = function () {
      reject(Error(JSON.stringify({
        status: xhr.status,
        statusTextInElse: xhr.statusText
      })))
    };
    xhr.send()
  })
}
