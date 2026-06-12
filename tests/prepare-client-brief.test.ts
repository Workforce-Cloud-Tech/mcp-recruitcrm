import { describe, expect, it, vi } from "vitest";

import { RecruitCrmApiError } from "../src/errors.js";
import { RecruitCrmClient } from "../src/recruitcrm/client.js";
import type { HttpRequestOptions, HttpResponse } from "../src/recruitcrm/http.js";
import { executePrepareClientBrief } from "../src/server.js";

const baseConfig = {
  apiToken: "test-token",
  baseUrl: "https://api.recruitcrm.io/v1",
  timeoutMs: 10_000,
  debugSchemaErrors: false,
};

type RouteFn = (request: HttpRequestOptions) => HttpResponse | Promise<HttpResponse> | undefined;

function buildTransport(route: RouteFn): ReturnType<typeof vi.fn> {
  return vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
    const response = await route(request);
    if (!response) {
      throw new Error(`Unmocked path: ${request.method} ${request.url.pathname}`);
    }
    return response;
  });
}

function ok(payload: unknown): HttpResponse {
  return { statusCode: 200, bodyText: JSON.stringify(payload) };
}

function searchResponse(data: unknown[], hasMore = false) {
  return {
    current_page: 1,
    next_page_url: hasMore ? "https://api.recruitcrm.io/v1/next?page=2" : null,
    data,
  };
}

function emptySearchResponse() {
  return searchResponse([]);
}

describe("executePrepareClientBrief", () => {
  it("builds a client brief with secondary contacts, pipeline blockers, activity, and pitched candidates", async () => {
    const transport = buildTransport((request) => {
      const path = request.url.pathname;

      if (path === "/v1/users") {
        return ok([
          { id: 99069, first_name: "Saurav", last_name: "Recruiter", status: "Active" },
          { id: 42, first_name: "Alex", last_name: "Owner", status: "Active" },
        ]);
      }

      if (path === "/v1/contacts/contact-primary") {
        return ok({
          id: 1,
          slug: "contact-primary",
          first_name: "Maya",
          last_name: "Chen",
          email: "maya@example.com",
          contact_number: "+1-555-0101",
          linkedin: "https://linkedin.example/maya",
          designation: "VP Engineering",
          company_slug: "company-northstar",
          owner: 99069,
          last_communication: "2026-05-31T09:00:00.000000Z",
          resource_url: "https://app.recruitcrm.io/contact/contact-primary",
        });
      }

      if (path === "/v1/contacts/contact-secondary") {
        return ok({
          id: 2,
          slug: "contact-secondary",
          first_name: "Tom",
          last_name: "Rivera",
          designation: "Talent Partner",
          company_slug: "company-northstar",
          owner: 42,
          resource_url: "https://app.recruitcrm.io/contact/contact-secondary",
        });
      }

      if (path === "/v1/companies/company-northstar") {
        return ok({
          id: 10,
          slug: "company-northstar",
          company_name: "Northstar Robotics",
          owner: 99069,
          city: "San Jose",
          state: "California",
          country: "United States",
          website: "https://northstar.example",
          contact_slug: ["contact-primary", "contact-secondary"],
          resource_url: "https://app.recruitcrm.io/company/company-northstar",
          off_limit_status_id: null,
          status_label: null,
        });
      }

      if (path === "/v1/contacts/search") {
        return ok(searchResponse([
          {
            id: 2,
            slug: "contact-secondary",
            first_name: "Tom",
            last_name: "Rivera",
            designation: "Talent Partner",
            company_slug: "company-northstar",
            updated_on: "2026-05-29T11:00:00.000000Z",
          },
        ]));
      }

      if (path === "/v1/jobs/search") {
        return ok(searchResponse([
          {
            id: 100,
            slug: "job-backend",
            name: "Senior Backend Engineer",
            company_slug: "company-northstar",
            contact_slug: "contact-primary",
            secondary_contact_slugs: ["contact-secondary"],
            job_status: { id: 1, label: "Open" },
            number_of_openings: 2,
            created_on: "2026-05-01T00:00:00.000000Z",
            updated_on: "2026-05-31T00:00:00.000000Z",
            owner: 99069,
            hiring_pipeline_id: 5067,
          },
        ]));
      }

      if (path === "/v1/jobs/job-backend/assigned-candidates") {
        return ok(searchResponse([
          {
            stage_date: "2026-05-25T00:00:00.000000Z",
            status: { status_id: 12, label: "Client Review" },
            candidate: {
              slug: "candidate-anika",
              first_name: "Anika",
              last_name: "Rao",
              position: "Backend Engineer",
              updated_on: "2026-05-28T10:00:00.000000Z",
            },
          },
          {
            stage_date: "2026-05-20T00:00:00.000000Z",
            status: { status_id: 99, label: "Placed" },
            candidate: {
              slug: "candidate-placed",
              first_name: "Luis",
              last_name: "Ortega",
              position: "Backend Engineer",
              updated_on: "2026-05-30T10:00:00.000000Z",
            },
          },
        ]));
      }

      if (path === "/v1/notes/search") {
        return ok(searchResponse([
          {
            id: 500,
            related_to: request.url.searchParams.get("related_to"),
            related_to_type: request.url.searchParams.get("related_to_type"),
            description: "Shortlist update sent.",
            created_on: "2026-05-30T09:00:00.000000Z",
            updated_on: "2026-05-31T09:00:00.000000Z",
          },
        ]));
      }

      if (path === "/v1/meetings/search") return ok(emptySearchResponse());
      if (path === "/v1/tasks/search") {
        return ok(searchResponse([
          {
            id: 600,
            title: "Follow up on shortlist",
            related_to: request.url.searchParams.get("related_to"),
            related_to_type: request.url.searchParams.get("related_to_type"),
            start_date: "2099-06-04T10:00:00.000000Z",
            updated_on: "2026-05-31T09:00:00.000000Z",
          },
        ]));
      }
      if (path === "/v1/call-logs/search") {
        return ok(searchResponse([
          {
            id: 700,
            call_type: "CALL_OUTGOING",
            related_to: request.url.searchParams.get("related_to"),
            related_to_type: request.url.searchParams.get("related_to_type"),
            call_started_on: "2026-05-29T08:00:00.000000Z",
          },
        ]));
      }

      if (path === "/v1/pitch/contact/pitch-stage/contact-primary") {
        return ok({
          data: {
            records: [
              {
                candidate_slug: "candidate-anika",
                contact_slug: "contact-primary",
                status_id: 3,
                status_label: "Submitted",
                candidate_name: "Anika Rao",
                candidate_position: "Backend Engineer",
                stage_date: "2026-05-25T00:00:00.000000Z",
              },
            ],
          },
        });
      }

      return undefined;
    });

    const client = new RecruitCrmClient(baseConfig, transport);
    const result = await executePrepareClientBrief(client, {
      contact_slug: "contact-primary",
      lookback_days: 30,
      max_open_jobs: 5,
    });

    expect(result.brief_type).toBe("client");
    expect(result.client.company?.name).toBe("Northstar Robotics");
    expect(result.client.primary_contact?.name).toBe("Maya Chen");
    expect(result.client.primary_contact?.relationships).toContain("input_contact");
    expect(result.client.primary_contact).not.toHaveProperty("email");
    expect(result.client.primary_contact).not.toHaveProperty("contact_number");
    expect(result.client.primary_contact).not.toHaveProperty("linkedin");

    const secondary = result.client.related_contacts.find((contact) => contact.slug === "contact-secondary");
    expect(secondary?.relationships).toContain("secondary_contact_on_job");
    expect(secondary?.job_slugs).toEqual(["job-backend"]);

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].secondary_contacts[0]).toMatchObject({
      slug: "contact-secondary",
      name: "Tom Rivera",
      designation: "Talent Partner",
    });
    expect(result.jobs[0].pipeline_summary).toMatchObject({
      assigned_count: 2,
      active_count: 1,
      terminal_count: 1,
    });
    expect(result.jobs[0].pipeline_summary?.candidates_waiting_on_client[0]).toMatchObject({
      candidate_slug: "candidate-anika",
      current_stage: "Client Review",
    });
    expect(result.account_health.candidates_waiting_on_client_count).toBe(1);
    expect(result.pitched_candidates?.returned_count).toBe(1);
    expect(result.suggested_talking_points.some((point) => point.includes("feedback"))).toBe(true);
    expect(result.coverage.assigned_candidate_pages_checked).toBe(1);
    expect(result.errors).toEqual([]);
  });

  it("requires a contact or company slug", async () => {
    const transport = buildTransport(() => undefined);
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(executePrepareClientBrief(client, {})).rejects.toBeInstanceOf(RecruitCrmApiError);
  });

  it("preserves a partial brief when secondary contact detail lookup fails", async () => {
    const transport = buildTransport((request) => {
      const path = request.url.pathname;
      if (path === "/v1/users") return ok([]);
      if (path === "/v1/companies/company-northstar") {
        return ok({
          slug: "company-northstar",
          company_name: "Northstar Robotics",
          contact_slug: ["contact-secondary"],
        });
      }
      if (path === "/v1/contacts/search") {
        return ok(searchResponse([
          {
            slug: "contact-secondary",
            first_name: "Tom",
            last_name: "Rivera",
            company_slug: "company-northstar",
          },
        ]));
      }
      if (path === "/v1/contacts/contact-secondary") {
        return { statusCode: 404, bodyText: JSON.stringify({ message: "Not found" }) };
      }
      if (path === "/v1/jobs/search") return ok(emptySearchResponse());
      if (path === "/v1/notes/search") return ok(emptySearchResponse());
      if (path === "/v1/meetings/search") return ok(emptySearchResponse());
      if (path === "/v1/tasks/search") return ok(emptySearchResponse());
      if (path === "/v1/call-logs/search") return ok(emptySearchResponse());
      return undefined;
    });

    const client = new RecruitCrmClient(baseConfig, transport);
    const result = await executePrepareClientBrief(client, {
      company_slug: "company-northstar",
    });

    expect(result.client.related_contacts[0]).toMatchObject({
      slug: "contact-secondary",
      name: "Tom Rivera",
    });
    expect(result.errors).toEqual([
      expect.objectContaining({
        source: "contacts",
        slug: "contact-secondary",
        status_code: 404,
      }),
    ]);
  });
});
