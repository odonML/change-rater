# change-rater
Automatically categorize your Pull Requests using tags based on the number of lines modified, optimizing the team's review time.


### test in act local 
action-test:
```yaml
name: Test Local Action
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Change Rater
        id: change_rater
        ses: odonML/change-rater@v3
        with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            minimal_threshold: 50
            moderate_threshold: 250
            complex_threshold: 500

      - name: Output Change Category
        run: echo "Change category is ${{ steps.change_rater.outputs.change_category }}"
```
payload.json
```json
{
  "pull_request": {
    "owner": "demo-user",
    "repo": "demo-repo",
    "number": 1,
    "additions": 500,
    "deletions": 50
  }
}
```
.env:
```
GITHUB_TOKEN=TOKEN_VALUE_HERE
```
comand:
```bash
act pull_request \
   -e payload.json \
   --secret-file .env \
   --env GITHUB_REPOSITORY=<user>/<repo> 
```
