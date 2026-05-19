# Recruit CRM MCP Server

Local `stdio` MCP server for [Recruit CRM](https://recruitcrm.io)'s Public API. Access your candidates, jobs, companies, tasks, meetings, notes, call logs, and more directly from AI tools like Claude and Codex.

## Install

### Option 1: Claude Desktop Extension (Recommended)

1. Download and install [Claude Desktop](https://claude.ai/download), then sign in
2. Download the latest `recruitcrm-mcp-server.mcpb` from the [Releases](https://github.com/saurav-rcrm/mcp-recruitcrm/releases) page
3. Double-click to install, or drag it into Claude Desktop
4. Enter your Recruit CRM API token when prompted (found in Recruit CRM → Admin Settings → API)

### Option 2: npm Package (for any MCP client)

```json
{
  "mcpServers": {
    "recruit-crm": {
      "command": "npx",
      "args": ["-y", "recruitcrm-mcp-server"],
      "env": {
        "RECRUITCRM_API_TOKEN": "<your-api-token>"
      }
    }
  }
}
```

#### Codex for Mac

In the Codex Mac app:

1. Open **Settings → MCP Servers → Add server**
2. Enter name `recruit_crm`
3. Select **STDIO**
4. Set **Command to launch** to `npx`
5. Add arguments `-y` and `recruitcrm-mcp-server`
6. Add environment variable `RECRUITCRM_API_TOKEN` with your Recruit CRM API token
7. Leave **Environment variable passthrough** empty
8. Leave **Working directory** blank unless you need a custom launch directory, then save

Manual Codex config fallback:

```toml
[mcp_servers.recruit_crm]
command = "npx"
args = ["-y", "recruitcrm-mcp-server"]

[mcp_servers.recruit_crm.env]
RECRUITCRM_API_TOKEN = "<your-api-token>"
```

Codex MCP stdio servers use `command`, `args`, and `env` fields as documented in the [Codex MCP docs](https://developers.openai.com/codex/mcp#stdio-servers).

> **Mac users:** If you get "Failed to spawn process", use the full path to `npx` (e.g. `/usr/local/bin/npx`) as the `command`.

## Example Prompts

Once installed, try asking Claude:

- "Show me open jobs for Acme Corp"
- "What companies do we have in the fintech space?"
- "What tasks are due this week?"
- "Pull up recent notes on John Smith"
- "Show call logs from last month"
- "Show me Frank's progression across all jobs"
- "How many candidates are in Interview hiring stage for Sales Consultant?"
- "Assign Jane Doe to the Operations Analyst job"
- "Move John Smith to the Interview stage for the Senior Engineer role"

## Tools

Ownership prompts: when a user says "my", "mine", or "owned by me", treat that as an owner-scoped request where the API supports owner filters. Resolve the Recruit CRM user id via `list_users` when needed, then use `owner_id` on `search_candidates`, `search_jobs`, `search_companies`, `search_contacts`, `search_tasks`, or `search_meetings`. `search_notes`, `search_call_logs`, and `search_hotlists` do not support owner filters; use an owner-scoped upstream search when applicable or explain the limitation.

| Tool | Description |
| --- | --- |
| `search_candidates` | Search candidates and return compact summaries for large result sets. Returns `slug`, which can be used for candidate detail lookup or Recruit CRM app links. Set `include_contact_info: true` to also include `email`, `contact_number`, and `linkedin` on each result (opt-in; off by default). Same flag is available on `list_candidates`. |
| `list_candidates` | List all candidates with pagination and sorting only (no filter required). Use `search_candidates` when you have filter criteria. |
| `create_candidate` | Create one candidate or update a confirmed duplicate via `existing_candidate_slug`, then optionally add up to 10 latest work history rows and up to 10 latest education history rows. Requires at least one of `first_name` or `last_name`; create calls require `owner_id` and `created_by`, and update calls require `updated_by` (resolve the acting user with `list_users`). Always check duplicates first with `search_candidates` using `email`, `contact_number`, or `linkedin`; duplicate messages label both `candidate_slug` and `candidate_id` so the slug is not confused with the numeric ID. |
| `search_jobs` | Search jobs and return compact summaries for large result sets. Returns job, company, and contact slugs, including `hiring_pipeline_id` for stage lookup. Supports client-side `job_status` filtering. |
| `list_jobs` | List all jobs with pagination and sorting only, including `hiring_pipeline_id`. Use `search_jobs` when you have filter criteria. |
| `search_companies` | Search companies and return compact summaries for large result sets. Returns company slug and related contact slugs for Recruit CRM app links. |
| `list_companies` | List all companies with pagination and sorting only. Use `search_companies` when you have filter criteria. |
| `search_contacts` | Search contacts and return compact summaries for large result sets. Requires at least one real filter; `sort_by`, `sort_order`, `page`, `exact_search`, and `include_contact_info` do not count by themselves. Set `include_contact_info: true` to also include `email`, `contact_number`, and `linkedin` on each result (opt-in; off by default). |
| `list_contacts` | List contacts with pagination and sorting only. Use this for unfiltered recent/all-contact requests. Supports the same opt-in `include_contact_info` flag as `search_contacts`. |
| `list_users` | List Recruit CRM users with compact `id`, `first_name`, `last_name`, and `status` fields. Set `include_teams: true` only when team memberships are needed. Set `include_contact_info: true` to also include `email` and `contact_number`. |
| `search_hotlists` | Search hotlists by required `related_to_type` and optional `name` / `shared` filters. Broad searches return compact rows with `related_count` only. When `name` is provided, results also include full `related_slugs`. |
| `create_hotlist` | Create one Recruit CRM hotlist. Requires `created_by` as a Recruit CRM user id and `shared` as `0` or `1`. This is a mutating non-destructive tool; use `add_records_to_hotlist` to add records afterward. |
| `add_records_to_hotlist` | Add up to 10 record slugs to an existing hotlist. This is an additive write tool. It runs sequentially, ignores duplicate input slugs, and returns `{ hotlist_id, requested_count, successful_count, failed_count, added_slugs, errors }` instead of failing the whole batch. |
| `search_tasks` | Search tasks and return compact task summaries with related entity context. |
| `list_task_types` | List compact task type rows with `id` and `label`. Use this before `create_task` to resolve the intended `task_type_id`. |
| `create_task` | Create one Recruit CRM task. Requires `task_type_id`, `title`, `description`, `reminder`, `start_date`, `owner_id`, and `created_by`; supports basic HTML/rich text and returns compact output without the related entity payload. |
| `search_meetings` | Search meetings and return compact meeting summaries with scheduling metadata. |
| `list_meeting_types` | List compact meeting type rows with `id` and `label`. Use this before `create_meeting` to resolve the intended `meeting_type_id`. |
| `create_meeting` | Create one Recruit CRM meeting. Requires `title`, `reminder`, `start_date`, `end_date`, `owner_id`, and `created_by`. Calendar invites are suppressed by default; to send them set `do_not_send_calendar_invites: false`, but only do this when the user explicitly asks. |
| `search_notes` | Search notes and return compact note summaries with related entity context. |
| `list_note_types` | List compact note type rows with `id` and `label`. Use this before `create_note` to resolve the intended `note_type_id`. |
| `create_note` | Create one Recruit CRM note. Requires `note_type_id`, `created_by`, related entity slug/type, and `description`; supports basic HTML/rich text and returns compact output without the related entity payload. |
| `search_call_logs` | Search call logs and return compact call summaries with related entity context. |
| `get_candidate_details` | Fetch full details for up to 10 candidates in parallel by slug. Duplicates are deduplicated. Returns `{ requested_count, successful_count, failed_count, candidates, errors }` and does not fail the whole call when one slug is bad. |
| `get_job_details` | Fetch one job by slug and return the raw Recruit CRM payload. |
| `get_company_details` | Fetch full details for up to 10 companies in parallel by slug. Returns `{ requested_count, successful_count, failed_count, companies, errors }` and does not fail the whole call when one slug is bad. |
| `get_contact_details` | Fetch full details for up to 10 contacts in parallel by slug. Returns `{ requested_count, successful_count, failed_count, contacts, errors }` and does not fail the whole call when one slug is bad. |
| `get_job_assigned_candidates` | Fetch assigned candidates for one job and return compact assignment summaries. The job's `hiring_pipeline_id` is included — use `hiring_pipeline_id 0` with `list_candidate_hiring_stages` for the master pipeline stages. |
| `list_candidate_hiring_stages` | List compact candidate hiring stage rows for a hiring pipeline. Pass `hiring_pipeline_id 0` (default) for the Master Hiring Pipeline or a job's `hiring_pipeline_id` for job-specific stages. Returns `status_id` values needed for `update_candidate_hiring_stage`. |
| `assign_candidate_to_job` | Assign a candidate to a job. Requires `candidate_slug`, `job_slug`, and `updated_by` (Recruit CRM user id). Write tool — use only when explicitly requested. |
| `update_candidate_hiring_stage` | Update a candidate's hiring stage for a specific job assignment. Requires `candidate_slug`, `job_slug`, `status_id` (resolve via `list_candidate_hiring_stages`), `stage_date`, and `updated_by`. Write tool — use only when explicitly requested. |
| `list_job_statuses` | List job pipeline statuses (Open, Closed, On Hold, plus custom labels) with `id` and `label` for resolving status names to the numeric `job_status_id` used by `search_jobs`. |
| `get_candidate_job_assignment_hiring_stage_history` | Fetch one candidate's job assignment hiring stage history. |
| `list_candidate_custom_fields` | List curated candidate custom field metadata. Set `include_non_searchable: true` to also include fields that cannot be used as search filters (e.g. file, user, company fields). |
| `get_candidate_custom_field_details` | Fetch curated details for one candidate custom field, including full option values. |
| `get_custom_field_dependencies` | Get parent-child dependency relationships for custom fields of a given entity type (`candidates`, `contacts`, `companies`, `jobs`, `deals`). Pass `field_id` to narrow results to the dependency subtree for one specific field. Call this before setting a child custom field — the parent field_id and its value must also be included in the `custom_fields` array or the API will reject the request with a dependency error. |
| `analyze_job_pipeline` | Diagnose a single job's hiring pipeline in one call: stage distribution, days-in-current-stage, idle candidates, bottleneck verdict, recent activity, and suggested next actions. Set `include_time_metrics: true` for time-to-hire and time-to-stage data (extra API calls; default false). |

Most tools are **read-only** (`readOnlyHint: true`). `create_candidate`, `create_hotlist`, `add_records_to_hotlist`, `create_task`, `create_meeting`, `create_note`, `assign_candidate_to_job`, and `update_candidate_hiring_stage` are mutating tools and should only be used when explicitly requested by the user.

`create_candidate` notes: pass `source` only when the user provides one. URL fields such as `linkedin`, `github`, `facebook`, `twitter`, `xing`, `avatar`, and `resume` are normalized with `https://` when the scheme is missing. For candidate custom fields, resolve the field id with `list_candidate_custom_fields`, confirm dropdown or multiselect values with `get_candidate_custom_field_details`, and call `get_custom_field_dependencies` for any child field to ensure the parent field and its value are also included in the `custom_fields` array.

## Open In Recruit CRM

Recruit CRM entities follow the app URL pattern `https://app.recruitcrm.io/<entity>/<slug>`.

| Entity | App Link Pattern |
| --- | --- |
| Candidate | `https://app.recruitcrm.io/candidate/{slug}` |
| Company | `https://app.recruitcrm.io/company/{slug}` |
| Contact | `https://app.recruitcrm.io/contact/{slug}` |
| Job | `https://app.recruitcrm.io/job/{slug}` |
| Deal | `https://app.recruitcrm.io/deal/{slug}` |

## Configuration

### Required

- `RECRUITCRM_API_TOKEN` — your Recruit CRM API token

### Optional

- `RECRUITCRM_BASE_URL` — default: `https://api.recruitcrm.io/v1`
- `RECRUITCRM_TIMEOUT_MS` — default: `10000`
- `RECRUITCRM_DEBUG_SCHEMA_ERRORS` — default: `false`

## Privacy And Security

- Runs **locally** on your machine over `stdio` — no data sent to third parties
- API tokens read from environment variables only; stored securely in OS keychain when using the `.mcpb` extension
- Search results exclude emails, phone numbers, and other sensitive fields by default
- Search and detail tools are read-only by default
- `create_candidate`, `create_hotlist`, `add_records_to_hotlist`, `create_task`, `create_meeting`, `create_note`, `assign_candidate_to_job`, and `update_candidate_hiring_stage` are write tools; this extension still does not expose delete operations
- See our full [Privacy Policy](https://recruitcrm.io/legal/privacy/)

## Troubleshooting

**"Server disconnected" or "Failed to spawn process"**
- Make sure Node.js ≥ 20 is installed ([nodejs.org](https://nodejs.org))
- On Mac, use the full path to `npx` (run `which npx` in terminal to find it)
- Use the `.mcpb` install option instead — it doesn't need Node set up

**"Authentication failed" / 401 errors**
- Verify your API token at Recruit CRM → Admin Settings → API
- Ensure the token has the required permissions for the tools you're using

**Other issues**
- File an issue at [GitHub Issues](https://github.com/saurav-rcrm/mcp-recruitcrm/issues)
- Contact support: [support@recruitcrm.io](mailto:support@recruitcrm.io)

## Local Development

```bash
npm install
npm run build
npm test
```

## License

MIT — see [LICENSE](./LICENSE)
