'use strict'

const protectedBranch = 'develop'

function addBlockMergesToDevelop (apiKey) {
    if (apiKey) {
        showBlockMergesToDevelopButton(apiKey)
    }
}

async function showBlockMergesToDevelopButton(apiKey) {
    let projectId = getProjectId();
    let pushAccessLevel = 0;
    let mergeAccessLevel;
    await getProtectedBranch(apiKey, projectId, protectedBranch).then(function (branch) {
        pushAccessLevel = branch.push_access_levels[0].access_level;
        mergeAccessLevel = branch.merge_access_levels[0].access_level;
    });
    if (mergeAccessLevel === 0) {
        $('div.nav-controls').prepend(`
            <button type="button" id="unblockMergesToDevelop" class="btn btn-success btn-inverted append-right-10">Unblock merges to develop</button>
        `);
        $("#unblockMergesToDevelop").click(function() {
            unprotectBranch(apiKey, projectId, protectedBranch).then(function () {
                protectBranch(apiKey, projectId, protectedBranch, {
                    push: pushAccessLevel,
                    merge: 30,
                    unprotect: 30
                })
            });
            window.location.reload()
        })
    } else {
        $('div.nav-controls').prepend(`
            <button type="button" id="blockMergesToDevelop" class="btn btn-danger append-right-10">Block merges to develop</button>
        `);
        $("#blockMergesToDevelop").click(function () {
            unprotectBranch(apiKey, projectId, protectedBranch).then(function () {
                protectBranch(apiKey, projectId, protectedBranch, {
                    push: pushAccessLevel,
                    merge: 0,
                    unprotect: 30
                })
            });
            window.location.reload()
        })
    }
}
