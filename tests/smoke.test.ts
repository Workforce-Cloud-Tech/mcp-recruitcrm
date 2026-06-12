import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterEach, describe, expect, it } from "vitest";

const transports: StdioClientTransport[] = [];

describe("stdio smoke test", () => {
  afterEach(async () => {
    await Promise.all(transports.map(async (transport) => transport.close().catch(() => undefined)));
    transports.length = 0;
  });

  it("starts over stdio and exposes the expected tools", async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["--import", "tsx", "src/index.ts"],
      cwd: process.cwd(),
      stderr: "pipe",
      env: {
        RECRUITCRM_API_TOKEN: "test-token",
      },
    });
    transports.push(transport);

    const client = new Client({
      name: "smoke-client",
      version: "1.0.0",
    });

    await client.connect(transport);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toEqual([
      "search_candidates",
      "list_candidates",
      "create_candidate",
      "update_candidate",
      "search_jobs",
      "list_jobs",
      "create_job",
      "update_job",
      "search_companies",
      "list_companies",
      "create_company",
      "update_company",
      "search_contacts",
      "list_contacts",
      "create_contact",
      "update_contact",
      "list_users",
      "list_teams",
      "list_candidate_questions",
      "list_hiring_pipelines",
      "list_languages_and_proficiencies",
      "list_currencies",
      "list_qualifications",
      "list_xml_jobboards",
      "search_hotlists",
      "create_hotlist",
      "add_records_to_hotlist",
      "search_tasks",
      "list_task_types",
      "create_task",
      "update_task",
      "search_meetings",
      "list_meeting_types",
      "create_meeting",
      "update_meeting",
      "search_notes",
      "list_note_types",
      "create_note",
      "update_note",
      "search_call_logs",
      "list_call_types",
      "create_call_log",
      "update_call_log",
      "get_candidate_details",
      "get_job_details",
      "get_company_details",
      "get_contact_details",
      "get_job_assigned_candidates",
      "list_candidate_hiring_stages",
      "list_pitch_stages",
      "pitch_candidate_to_contact",
      "update_candidate_pitch_stage",
      "get_pitch_history",
      "get_pitched_records",
      "assign_candidate_to_job",
      "update_candidate_hiring_stage",
      "list_job_statuses",
      "list_contact_stages",
      "list_off_limit_statuses",
      "mark_candidate_off_limit",
      "mark_contact_off_limit",
      "mark_company_off_limit",
      "mark_records_available",
      "get_candidate_job_assignment_hiring_stage_history",
      "list_custom_fields",
      "get_custom_field_details",
      "get_custom_field_dependencies",
      "prepare_client_brief",
      "analyze_job_pipeline",
    ]);

    await client.close();
  }, 15000);
});
