'use strict'

const HTTP_GET = 'GET'
const HTTP_PUT = 'PUT'
var svcHost = 'https://' + (new URL(window.location.href).hostname) + '/api/v4'

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
 * Fetches all approvals for a given Merge Request using its iid via an Xhr request.
 * @param {Integer} mergeRequestId the merge request iid.
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
 * Fetches all approvals for a given Merge Request using its iid via an Xhr request.
 * @param {Integer} mergeRequestId the merge request iid.
 * @returns xhr response.
 */
function getAwardEmoji (projectId, mergeRequestId) {
  return makeXhrRequest(
    HTTP_GET,
    `${svcHost}/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
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
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)

    // When the function loads
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(JSON.parse(xhr.response))
      } else {
        reject(Error({
          status: xhr.status,
          statusTextInElse: xhr.statusText
        }))
      }
    }

    // Error handling
    xhr.onerror = function () {
      console.log(xhr.status)
      reject(Error({
        status: xhr.status,
        statusTextInElse: xhr.statusText
      }))
    }
    xhr.send()
  })
}
