import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const token = core.getInput('github_token');
    const octokit = github.getOctokit(token);

    const minimalThreshold = core.getInput("minimal_threshold");
    const moderateThreshold = core.getInput("moderate_threshold");
    const complexThreshold = core.getInput("complex_threshold");

    const context = github.context;

    const { owner, repo } = context.repo;
    const prNumber = context.payload.pull_request.number;
    
    const pullRequest = context.payload.pull_request;
    const totalChanges = pullRequest.additions + pullRequest.deletions;

    let complexity = "no changes";
    if(totalChanges > 1 && totalChanges <= minimalThreshold) {
        complexity = "minimal";
    } else if(totalChanges > minimalThreshold && totalChanges <= moderateThreshold) {
        complexity = "moderate";
    } else if(totalChanges > moderateThreshold && totalChanges > complexThreshold) {
        complexity = "complex";
    }

    const label = `change-${complexity}`;
    await octokit.rest.issues.addLabels({
      owner: owner,
      repo: repo,
      issue_number: prNumber, // En la API de GitHub, los PRs se manejan como issues
      labels: [label]
    });

    core.info(`Etiqueta ${label} añadida con éxito.`);
    core.setOutput("change_category", complexity);

} catch (error) {
  core.setFailed(error.message);
}
