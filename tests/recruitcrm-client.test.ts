import { afterEach, describe, expect, it, vi } from "vitest";

import {
  RecruitCrmClient,
  buildSearchCandidatesRequest,
  buildSearchJobsRequest,
  buildSearchCompaniesRequest,
  buildSearchContactsRequest,
} from "../src/recruitcrm/client.js";
import type { HttpRequestOptions, HttpResponse } from "../src/recruitcrm/http.js";
import {
  sampleCallLogSearchResponse,
  sampleCallLogTypeListResponse,
  sampleCandidateHistoryCreateResponse,
  sampleCandidateHiringStageUpdateResponse,
  sampleCandidateJobAssignmentResponse,
  sampleCandidateQuestionListResponse,
  sampleHiringPipelineResponse,
  sampleHiringPipelineListResponse,
  sampleCandidateJobAssignmentHiringStageHistoryResponse,
  sampleCandidateDetailResponse,
  sampleCompanyDetailResponse,
  sampleCompanySearchResponse,
  sampleContactDetailResponse,
  sampleContactSearchResponse,
  sampleCreatedCandidateResponse,
  sampleCreatedContactResponse,
  sampleCreatedCallLogResponse,
  sampleCreatedHotlistResponse,
  sampleCreatedNoteResponse,
  sampleCreatedTaskResponse,
  sampleHotlistSearchResponse,
  sampleJobAssignedCandidatesResponse,
  sampleJobDetailResponse,
  sampleJobSearchResponse,
  sampleMeetingSearchResponse,
  sampleMarkCandidateAvailableResponse,
  sampleMarkCandidateOffLimitResponse,
  sampleMarkCompanyAvailableResponse,
  sampleMarkCompanyOffLimitResponse,
  sampleMarkContactAvailableResponse,
  sampleMarkContactOffLimitResponse,
  sampleNoteSearchResponse,
  sampleNoteTypeListResponse,
  sampleOffLimitStatusListResponse,
  samplePitchCandidateResponse,
  samplePitchHistoryResponse,
  samplePitchedRecordsResponse,
  samplePitchPipelineResponse,
  sampleUpdateCandidatePitchStageResponse,
  sampleCurrencyListResponse,
  sampleLanguageListResponse,
  sampleQualificationListResponse,
  sampleSearchResponse,
  sampleTaskSearchResponse,
  sampleTaskTypeListResponse,
  sampleTeamListResponse,
  sampleUserListResponse,
  sampleUserListResponseBareTeams,
  sampleXmlJobboardsResponse,
} from "./fixtures.js";

const baseConfig = {
  apiToken: "test-token",
  baseUrl: "https://api.recruitcrm.io/v1",
  timeoutMs: 10_000,
  debugSchemaErrors: false,
};

describe("RecruitCrmClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists metadata endpoints", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/teams")) {
        expect(request.url.searchParams.get("expand")).toBe("user");
        return { statusCode: 200, bodyText: JSON.stringify(sampleTeamListResponse) };
      }

      if (request.url.pathname.endsWith("/candidate-questions")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleCandidateQuestionListResponse) };
      }

      if (request.url.pathname.endsWith("/hiring-pipelines")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleHiringPipelineListResponse) };
      }

      if (request.url.pathname.endsWith("/languages")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleLanguageListResponse) };
      }

      if (request.url.pathname.endsWith("/currencies")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleCurrencyListResponse) };
      }

      if (request.url.pathname.endsWith("/qualifications")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleQualificationListResponse) };
      }

      if (request.url.pathname.endsWith("/jobs/list-xml-jobboards")) {
        return { statusCode: 200, bodyText: JSON.stringify(sampleXmlJobboardsResponse) };
      }

      throw new Error(`Unexpected request: ${request.url.pathname}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.listTeams({ expand: "user" })).resolves.toHaveLength(2);
    await expect(client.listCandidateQuestions()).resolves.toHaveLength(3);
    await expect(client.listHiringPipelines()).resolves.toHaveLength(2);
    await expect(client.listLanguages()).resolves.toHaveLength(3);
    await expect(client.listCurrencies()).resolves.toHaveLength(3);
    await expect(client.listQualifications()).resolves.toHaveLength(3);
    await expect(client.listXmlJobboards()).resolves.toEqual(sampleXmlJobboardsResponse);
    expect(transport).toHaveBeenCalledTimes(7);
  });

  it("lists off-limit statuses and marks entities off-limit", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/off-limit-status")) {
        expect(request.method).toBe("GET");
        return { statusCode: 200, bodyText: JSON.stringify(sampleOffLimitStatusListResponse) };
      }

      if (request.url.pathname.endsWith("/candidates/mark-off-limit")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          candidate_slugs: "candidate-sample-001,candidate-sample-002",
          status_id: 7,
          end_date: "29-06-2026",
          reason: "Codex test",
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkCandidateOffLimitResponse) };
      }

      if (request.url.pathname.endsWith("/contacts/mark-off-limit")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          contact_slugs: "contact-sample-001",
          status_id: 7,
          end_date: "29-06-2026",
          reason: "Codex test",
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkContactOffLimitResponse) };
      }

      if (request.url.pathname.endsWith("/companies/mark-off-limit")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          company_slugs: "company-sample-001",
          status_id: 7,
          end_date: "29-06-2026",
          reason: "Codex test",
          mark_contact_off_limit: false,
          mark_candidate_off_limit: true,
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkCompanyOffLimitResponse) };
      }

      if (request.url.pathname.endsWith("/candidates/mark-as-available")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          candidate_slugs: "candidate-sample-001,candidate-sample-002",
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkCandidateAvailableResponse) };
      }

      if (request.url.pathname.endsWith("/contacts/mark-as-available")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          contact_slugs: "contact-sample-001",
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkContactAvailableResponse) };
      }

      if (request.url.pathname.endsWith("/companies/mark-as-available")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          company_slugs: "company-sample-001",
          mark_contact_available: false,
          mark_candidate_available: true,
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleMarkCompanyAvailableResponse) };
      }

      throw new Error(`Unexpected request: ${request.url.pathname}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.listOffLimitStatuses()).resolves.toEqual(sampleOffLimitStatusListResponse);
    await expect(
      client.markCandidateOffLimit({
        candidate_slugs: ["candidate-sample-001", "candidate-sample-002"],
        status_id: 7,
        end_date: "29-06-2026",
        reason: "Codex test",
      }),
    ).resolves.toEqual(sampleMarkCandidateOffLimitResponse);
    await expect(
      client.markContactOffLimit({
        contact_slugs: ["contact-sample-001"],
        status_id: 7,
        end_date: "29-06-2026",
        reason: "Codex test",
      }),
    ).resolves.toEqual(sampleMarkContactOffLimitResponse);
    await expect(
      client.markCompanyOffLimit({
        company_slugs: ["company-sample-001"],
        status_id: 7,
        end_date: "29-06-2026",
        reason: "Codex test",
        mark_contact_off_limit: false,
        mark_candidate_off_limit: true,
      }),
    ).resolves.toEqual(sampleMarkCompanyOffLimitResponse);
    await expect(
      client.markRecordsAvailable({
        record_type: "candidate",
        slugs: ["candidate-sample-001", "candidate-sample-002"],
      }),
    ).resolves.toEqual(sampleMarkCandidateAvailableResponse);
    await expect(
      client.markRecordsAvailable({
        record_type: "contact",
        slugs: ["contact-sample-001"],
      }),
    ).resolves.toEqual(sampleMarkContactAvailableResponse);
    await expect(
      client.markRecordsAvailable({
        record_type: "company",
        slugs: ["company-sample-001"],
        mark_contact_available: false,
        mark_candidate_available: true,
      }),
    ).resolves.toEqual(sampleMarkCompanyAvailableResponse);
    expect(transport).toHaveBeenCalledTimes(7);
  });

  it("maps already-available markRecordsAvailable errors to a friendly message", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/companies/mark-as-available");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        company_slugs: "company-sample-001",
        mark_contact_available: false,
        mark_candidate_available: false,
      });

      return {
        statusCode: 422,
        bodyText: JSON.stringify({
          error: true,
          errorCode: 422,
          errorMessage: "At least one value must change!",
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.markRecordsAvailable({
        record_type: "company",
        slugs: ["company-sample-001"],
        mark_contact_available: false,
        mark_candidate_available: false,
      }),
    ).rejects.toMatchObject({
      message:
        "Recruit CRM did not mark the company record(s) available because they are already available or the requested availability settings would not change anything. No record was changed.",
    });
  });

  it("ignores unused search field type changes", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 2,
        next_page_url: "https://api.recruitcrm.io/v1/candidates/search?page=3",
        data: [
          {
            slug: "010011",
            first_name: "Sample",
            last_name: "Candidate",
            position: "Software Developer",
            current_organization: "Acme Labs",
            current_status: "Employed",
            city: "Example City",
            updated_on: "2020-06-29T05:36:22.000000Z",
            current_salary: { amount: 150000 },
            candidate_summary: { html: "<p>summary</p>" },
            owner: { id: 10001 },
          },
        ],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCandidates({ first_name: "Sample" });
    const candidate = result.data[0];

    expect(candidate).toMatchObject({
      slug: "010011",
      first_name: "Sample",
      last_name: "Candidate",
      position: "Software Developer",
    });
  });

  it("parses assigned candidates payloads while capping limit and preserving status_id filters", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/jobs/job-sample-001/assigned-candidates");
      expect(request.url.searchParams.get("page")).toBe("2");
      expect(request.url.searchParams.get("limit")).toBe("100");
      expect(request.url.searchParams.get("status_id")).toBe("8,12");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleJobAssignedCandidatesResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getJobAssignedCandidates("job-sample-001", {
      page: 2,
      limit: 250,
      status_id: "8,12",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/jobs/job-sample-001/assigned-candidates?page=2");
    expect(result.data[0]).toMatchObject({
      stage_date: "2026-02-20T09:08:45.000000Z",
      status: {
        status_id: "8",
        label: "Placed",
      },
      candidate: {
        slug: "candidate-assigned-sample-001",
        first_name: "Michael",
        last_name: "Scott",
        position: "Regional Manager",
        current_organization: "Dunder Mifflin",
        current_status: "Employed",
        city: "Scranton",
        country: "United States",
      },
    });
  });

  it("accepts empty assigned candidate pages", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getJobAssignedCandidates("job-sample-001", {});

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses hiring pipeline payloads and tolerates status_id-backed rows", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/hiring-pipelines/0");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleHiringPipelineResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listCandidateHiringStages();

    expect(result).toEqual(sampleHiringPipelineResponse);
  });

  it("fetches hiring stages for a specific hiring pipeline id", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/hiring-pipelines/5067");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleHiringPipelineResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listCandidateHiringStages({ hiring_pipeline_id: 5067 });

    expect(result).toEqual(sampleHiringPipelineResponse);
  });

  it("calls pitch candidate endpoints and parses pitch payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/pitch-pipeline")) {
        expect(request.method).toBe("GET");
        return { statusCode: 200, bodyText: JSON.stringify(samplePitchPipelineResponse) };
      }

      if (request.url.pathname.endsWith("/pitch/candidate-pitch-sample-001/contact/contact-pitch-sample-001")) {
        expect(request.method).toBe("POST");
        expect(request.url.searchParams.get("created_by")).toBe("99069");
        return { statusCode: 200, bodyText: JSON.stringify(samplePitchCandidateResponse) };
      }

      if (request.url.pathname.endsWith("/pitch/candidate-pitch-sample-001/updated-stage/contact-pitch-sample-001")) {
        expect(request.method).toBe("POST");
        expect(request.url.searchParams.get("updated_by")).toBe("99069");
        expect(request.jsonBody).toEqual({
          status_id: 483,
          stage_date: "2026-06-03T08:30:00.000000Z",
          remark: "Codex verification",
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleUpdateCandidatePitchStageResponse) };
      }

      if (request.url.pathname.endsWith("/pitch/pitch-candidate-history/candidate-pitch-sample-001")) {
        expect(request.method).toBe("GET");
        return { statusCode: 200, bodyText: JSON.stringify(samplePitchHistoryResponse) };
      }

      if (request.url.pathname.endsWith("/pitch/candidate/pitch-stage/candidate-pitch-sample-001")) {
        expect(request.method).toBe("GET");
        return { statusCode: 200, bodyText: JSON.stringify(samplePitchedRecordsResponse) };
      }

      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.listPitchStages()).resolves.toEqual(samplePitchPipelineResponse);
    await expect(
      client.pitchCandidateToContact({
        candidate_slug: "candidate-pitch-sample-001",
        contact_slug: "contact-pitch-sample-001",
        created_by: 99069,
      }),
    ).resolves.toEqual(samplePitchCandidateResponse);
    await expect(
      client.updateCandidatePitchStage({
        candidate_slug: "candidate-pitch-sample-001",
        contact_slug: "contact-pitch-sample-001",
        status_id: 483,
        stage_date: "2026-06-03T08:30:00.000000Z",
        updated_by: 99069,
        remark: "Codex verification",
      }),
    ).resolves.toEqual(sampleUpdateCandidatePitchStageResponse);
    await expect(client.getPitchHistory("candidate", "candidate-pitch-sample-001")).resolves.toEqual(
      samplePitchHistoryResponse,
    );
    await expect(client.getPitchedRecords("candidate", "candidate-pitch-sample-001")).resolves.toEqual(
      samplePitchedRecordsResponse,
    );
    expect(transport).toHaveBeenCalledTimes(5);
  });

  it("updates a candidate hiring stage and parses the compact assignment payload", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.method).toBe("POST");
      expect(request.url.pathname).toBe("/v1/candidates/candidate-sample-001/hiring-stages/job-sample-001");
      expect(request.jsonBody).toEqual({
        status_id: 7006,
        remark: "<p>Shortlisted because xyz</p>",
        stage_date: "2020-03-25T16:14:28.000000Z",
        updated_by: 453,
        create_placement: false,
      });

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCandidateHiringStageUpdateResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.updateCandidateHiringStage({
      candidate_slug: "candidate-sample-001",
      job_slug: "job-sample-001",
      status_id: 7006,
      remark: "<p>Shortlisted because xyz</p>",
      stage_date: "2020-03-25T16:14:28.000000Z",
      updated_by: 453,
      create_placement: false,
    });

    expect(result).toEqual(sampleCandidateHiringStageUpdateResponse);
  });

  it("rejects empty candidate hiring stage update success payloads", async () => {
    const transport = vi.fn(async (): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({}),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.updateCandidateHiringStage({
        candidate_slug: "candidate-sample-001",
        job_slug: "job-sample-001",
        status_id: 7006,
        stage_date: "2020-03-25T16:14:28.000000Z",
        updated_by: 453,
      }),
    ).rejects.toThrow(/did not confirm the candidate hiring stage update.*assignment may not exist.*updated_by.*stage may not be valid/);
  });

  it("assigns a candidate to a job and parses the compact assignment payload", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.method).toBe("POST");
      expect(request.url.pathname).toBe("/v1/candidates/candidate-sample-001/assign");
      expect(request.url.searchParams.get("job_slug")).toBe("job-sample-001");
      expect(request.url.searchParams.get("updated_by")).toBe("453");
      expect(request.jsonBody).toBeUndefined();

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCandidateJobAssignmentResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.assignCandidateToJob({
      candidate_slug: "candidate-sample-001",
      job_slug: "job-sample-001",
      updated_by: 453,
    });

    expect(result).toEqual(sampleCandidateJobAssignmentResponse);
  });

  it("rejects empty candidate job assignment success payloads", async () => {
    const transport = vi.fn(async (): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({}),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.assignCandidateToJob({
        candidate_slug: "candidate-sample-001",
        job_slug: "job-sample-001",
        updated_by: 453,
      }),
    ).rejects.toThrow(/did not confirm the candidate job assignment.*candidate or job.*updated_by.*already be assigned/);
  });

  it("maps invalid assign updated_by errors without a candidate-not-found prefix", async () => {
    const transport = vi.fn(async (): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({
        error: true,
        errorCode: 404,
        errorMessage: "Updated By Id is not valid",
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.assignCandidateToJob({
        candidate_slug: "candidate-sample-001",
        job_slug: "job-sample-001",
        updated_by: 999999999,
      }),
    ).rejects.toThrow(/^Invalid updater\. Details: Updated By Id is not valid$/);
  });

  it("parses task search payloads while tolerating large nested related objects", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleTaskSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchTasks({
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/tasks/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 2572223,
      related_to: "candidate-related-sample-001",
      task_type: null,
      related: {
        first_name: "Sample",
        last_name: "Candidate",
      },
      title: "Follow up",
      status: 1,
    });
  });

  it("parses job search payloads while tolerating large nested payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleJobSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchJobs({
      job_slug: "job-sample-001",
      limit: 1,
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/jobs/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 313,
      slug: "job-sample-001",
      name: "Operations Analyst",
      company_slug: "company-sample-001",
      contact_slug: "contact-sample-001",
      salary_type: {
        id: "2",
        label: "Annual Salary",
      },
      job_status: {
        id: 1,
        label: "Open",
      },
      job_type: "Contract",
      enable_job_application_form: 1,
    });
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.objectContaining({
          pathname: "/v1/jobs/search",
        }),
      }),
    );
  });

  it("accepts empty paginated job search payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchJobs({ name: "Operations Analyst" });

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses company search payloads while tolerating large nested payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleCompanySearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCompanies({
      company_slug: "company-sample-001",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/companies/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 403,
      slug: "company-sample-001",
      company_name: "Example Holdings",
      owner: 3735,
      contact_slug: ["contact-sample-001", "", null, "contact-sample-002"],
      is_child_company: "No",
      is_parent_company: "Yes",
      off_limit_status_id: "12",
      status_label: "Off Limits",
    });
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.objectContaining({
          pathname: "/v1/companies/search",
        }),
      }),
    );
  });

  it("accepts empty paginated company search payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCompanies({ company_name: "Example Holdings" });

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses contact search payloads while tolerating large nested payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleContactSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchContacts({
      contact_slug: "contact-sample-001",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/contacts/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 501,
      slug: "contact-sample-001",
      first_name: "Pam",
      last_name: "Beesly",
      email: "pam.beesly@example.com",
      contact_number: "+1-555-0142",
      linkedin: "https://www.linkedin.com/in/pam-beesly",
      company_slug: "company-sample-001",
      additional_company_slugs: ["company-sample-aux-001", "", null],
      designation: "Office Manager",
      city: "Scranton",
      locality: "Downtown",
    });
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.objectContaining({
          pathname: "/v1/contacts/search",
        }),
      }),
    );
  });

  it("normalizes empty contact search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchContacts({ first_name: "Pam" });

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses contact list payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts");
      expect(request.url.searchParams.get("page")).toBe("2");
      expect(request.url.searchParams.get("limit")).toBe("25");
      expect(request.url.searchParams.get("sort_by")).toBe("createdon");
      expect(request.url.searchParams.get("sort_order")).toBe("asc");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleContactSearchResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listContacts({
      page: 2,
      limit: 25,
      sort_by: "createdon",
      sort_order: "asc",
    });

    expect(result.current_page).toBe(1);
    expect(result.data[0]).toMatchObject({
      slug: "contact-sample-001",
      company_slug: "company-sample-001",
    });
  });

  it("parses hotlist search payloads and preserves large related strings", async () => {
    const longRelated = Array.from({ length: 200 }, (_, index) => `candidate-hotlist-${index + 1}`).join(",");
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/hotlists/search");
      expect(request.url.searchParams.get("page")).toBe("2");
      expect(request.url.searchParams.get("related_to_type")).toBe("candidate");
      expect(request.url.searchParams.get("name")).toBe("Product");
      expect(request.url.searchParams.get("shared")).toBe("1");

      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          ...sampleHotlistSearchResponse,
          data: [
            {
              ...sampleHotlistSearchResponse.data[0],
              related: longRelated,
            },
            sampleHotlistSearchResponse.data[1],
          ],
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchHotlists({
      page: 2,
      related_to_type: "candidate",
      name: "Product",
      shared: 1,
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/hotlists/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 702,
      name: "Product Leaders",
      related_to_type: "candidate",
      shared: 1,
      created_by: 66960,
      related: longRelated,
    });
    expect(result.data[1]?.related).toBeNull();
  });

  it("normalizes empty hotlist search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchHotlists({ related_to_type: "candidate" });

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("posts createHotlist requests and parses the created hotlist response", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/hotlists");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        name: "Product Leaders",
        related_to_type: "candidate",
        shared: 0,
        created_by: 453,
      });

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCreatedHotlistResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.createHotlist({
      name: "Product Leaders",
      related_to_type: "candidate",
      shared: 0,
      created_by: 453,
    });

    expect(result).toMatchObject({
      id: 307309,
      name: "Product Leaders",
      related_to_type: "candidate",
      shared: 0,
      created_by: 453,
    });
  });

  it("maps createHotlist validation errors through the existing hotlist error handler", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 422,
      bodyText: JSON.stringify({ message: "created_by is required" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.createHotlist({
        name: "Product Leaders",
        related_to_type: "candidate",
        shared: 0,
        created_by: 453,
      }),
    ).rejects.toMatchObject({
      message: "Recruit CRM API validation error (422): created_by is required",
    });
  });

  it("posts addRecordToHotlist requests without requiring a JSON success payload", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/hotlists/702/add-record");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        related: "candidate-sample-001",
      });

      return {
        statusCode: 204,
        bodyText: "",
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.addRecordToHotlist(702, "candidate-sample-001")).resolves.toBeUndefined();
  });

  it("maps hotlist add-record 404s to hotlist not found", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({ message: "Not found" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.addRecordToHotlist(999, "candidate-sample-001")).rejects.toMatchObject({
      message: expect.stringMatching(/^Hotlist not found\./),
    });
  });

  it("lists users without expanding teams by default", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/users");
      expect(request.url.searchParams.get("expand")).toBeNull();

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleUserListResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listUsers({});

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      id: 453,
      first_name: "Sean",
      status: "Active",
    });
  });

  it("sends expand=team when listing users with teams", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/users");
      expect(request.url.searchParams.get("expand")).toBe("team");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleUserListResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listUsers({ include_teams: true });

    expect(result[0]?.teams).toHaveLength(2);
  });

  it("parses user list response where teams is an array of bare numbers", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleUserListResponseBareTeams),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listUsers({});

    expect(result).toHaveLength(1);
    expect(result[0]?.teams).toEqual([1435, 2253, 9871]);
  });

  it("normalizes empty task search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchTasks({});

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("accepts task_type as a single object in task search payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        next_page_url: null,
        data: [
          {
            ...sampleTaskSearchResponse.data[0],
            task_type: {
              id: 209961,
              label: "Call Candidate",
            },
          },
        ],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchTasks({
      created_from: "2026-03-01",
      created_to: "2026-04-08",
    });

    expect(result.data[0]).toMatchObject({
      id: 2572223,
      task_type: {
        id: 209961,
        label: "Call Candidate",
      },
    });
  });

  it("accepts collaborator_users as primitive ids in task search payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        next_page_url: null,
        data: [
          {
            ...sampleTaskSearchResponse.data[0],
            collaborator_users: [99069],
          },
        ],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchTasks({
      created_from: "2026-01-01",
      created_to: "2026-05-28",
    });

    expect(result.data[0]?.collaborator_users).toEqual([99069]);
  });

  it("parses task type list payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/task-types");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleTaskTypeListResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listTaskTypes();

    expect(result).toEqual(sampleTaskTypeListResponse);
  });

  it("creates tasks with rich text descriptions", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/tasks");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        task_type_id: 332,
        title: "Follow up call",
        description: "<p><strong>Rich task</strong></p>",
        reminder: 30,
        start_date: "2026-04-28T04:30:00.000000Z",
        owner_id: 453,
        created_by: 453,
        related_to: "candidate-related-sample-001",
        related_to_type: "candidate",
        associated_candidates: "candidate-related-sample-001,candidate-related-sample-002",
        collaborators: "12654",
      });

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCreatedTaskResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.createTask({
      task_type_id: 332,
      title: "Follow up call",
      description: "<p><strong>Rich task</strong></p>",
      reminder: 30,
      start_date: "2026-04-28T04:30:00.000000Z",
      owner_id: 453,
      created_by: 453,
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
      associated_candidates: ["candidate-related-sample-001", "candidate-related-sample-002"],
      collaborator_user_ids: [12654],
    });

    expect(result).toEqual(sampleCreatedTaskResponse);
  });

  it("parses meeting search payloads and tolerates large attendee payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleMeetingSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchMeetings({
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/meetings/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 47202185,
      title: "Sample Candidate/Product Manager (Acme Labs)",
      meeting_type: {
        id: 20707,
        label: "Candidate Interview with Client",
      },
      related: {
        first_name: "Sample",
        last_name: "Candidate",
      },
      all_day: 1,
    });
  });

  it("normalizes empty meeting search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchMeetings({});

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses note search payloads and tolerates large related objects", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleNoteSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchNotes({
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/notes/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 24667666,
      note_type: {
        id: 205989,
        label: "Candidate Interaction",
      },
      related_to: "candidate-related-sample-001",
      related: {
        first_name: "Sample",
        last_name: "Candidate",
      },
    });
  });

  it("normalizes empty note search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchNotes({});

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("parses note type list payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/note-types");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleNoteTypeListResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listNoteTypes();

    expect(result).toEqual(sampleNoteTypeListResponse);
  });

  it("creates notes with rich text descriptions", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/notes");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        note_type_id: 108871,
        description: "<p><strong>Rich text</strong></p>",
        related_to: "candidate-related-sample-001",
        related_to_type: "candidate",
        created_by: 453,
        associated_candidates: "candidate-related-sample-001,candidate-related-sample-002",
      });

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCreatedNoteResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.createNote({
      note_type_id: 108871,
      description: "<p><strong>Rich text</strong></p>",
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
      created_by: 453,
      associated_candidates: ["candidate-related-sample-001", "candidate-related-sample-002"],
    });

    expect(result).toEqual(sampleCreatedNoteResponse);
  });

  it("parses call log search payloads and tolerates large related objects", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleCallLogSearchResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCallLogs({
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
    });

    expect(result.current_page).toBe(1);
    expect(result.next_page_url).toBe("https://api.recruitcrm.io/v1/call-logs/search?page=2");
    expect(result.data[0]).toMatchObject({
      id: 498645,
      call_type: "CALL_OUTGOING",
      custom_call_type: {
        id: 2,
        label: "Pitch Attempt",
      },
      related: {
        first_name: "Sample",
        last_name: "Candidate",
      },
      duration: 17,
    });
  });

  it("normalizes empty call log search arrays into an empty paginated response", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCallLogs({});

    expect(result).toEqual({
      current_page: 1,
      next_page_url: null,
      data: [],
    });
  });

  it("accepts related: 'Not Available' string in broad call log search without related_to", async () => {
    const payload = {
      current_page: 1,
      next_page_url: null,
      data: [
        {
          id: 9001,
          call_type: "CALL_OUTGOING",
          call_started_on: "2026-05-01T10:00:00.000000Z",
          contact_number: null,
          call_notes: null,
          related_to: null,
          related_to_type: null,
          related: "Not Available",
          duration: 5,
          created_on: "2026-05-01T10:00:00.000000Z",
          updated_on: "2026-05-01T10:00:00.000000Z",
          created_by: 1,
          updated_by: 1,
        },
      ],
    };

    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(payload),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.searchCallLogs({ starting_from: "2026-01-01", starting_to: "2026-12-31" });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(9001);
    expect(result.data[0].related).toBe("Not Available");
  });

  it("parses call type list payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/custom-call-types");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCallLogTypeListResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.listCallTypes();

    expect(result).toEqual(sampleCallLogTypeListResponse);
  });

  it("creates call logs with the correct POST body", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/call-logs");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toEqual({
        call_type: "CALL_OUTGOING",
        custom_call_type_id: 1,
        call_started_on: "2026-05-20T10:00:00.000000Z",
        related_to_type: "candidate",
        created_by: 453,
        updated_by: 453,
        contact_number: "+1-555-0101",
        call_notes: "Discussed requirements",
        related_to: "candidate-related-sample-001",
        associated_candidates: "candidate-related-sample-001,candidate-related-sample-002",
        collaborator_user_ids: "34,99",
      });

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCreatedCallLogResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.createCallLog({
      call_type: "CALL_OUTGOING",
      custom_call_type_id: 1,
      call_started_on: "2026-05-20T10:00:00.000000Z",
      related_to_type: "candidate",
      created_by: 453,
      updated_by: 453,
      contact_number: "+1-555-0101",
      call_notes: "Discussed requirements",
      related_to: "candidate-related-sample-001",
      associated_candidates: ["candidate-related-sample-001", "candidate-related-sample-002"],
      collaborator_user_ids: [34, 99],
    });

    expect(result).toEqual(sampleCreatedCallLogResponse);
  });

  it("updates activities with partial POST bodies", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname === "/v1/tasks/66753909") {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          title: "Updated task title",
          updated_by: 453,
          collaborators: "34,99",
        });

        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedTaskResponse) };
      }

      if (request.url.pathname === "/v1/meetings/47202185") {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          title: "Updated meeting title",
          updated_by: 453,
          attendee_users: "34,99",
          do_not_send_calendar_invites: 1,
        });

        return { statusCode: 200, bodyText: JSON.stringify(sampleMeetingSearchResponse.data[0]) };
      }

      if (request.url.pathname === "/v1/notes/66752552") {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          description: "<p>Updated note</p>",
          updated_by: 453,
          collaborator_user_ids: "34,99",
        });

        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedNoteResponse) };
      }

      if (request.url.pathname === "/v1/call-logs/498700") {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual({
          call_notes: "Updated call notes",
          duration: "120",
          updated_by: 453,
        });

        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedCallLogResponse) };
      }

      throw new Error(`Unexpected request: ${request.url.pathname}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(
      client.updateTask(66753909, {
        task_id: 66753909,
        title: "Updated task title",
        updated_by: 453,
        collaborator_user_ids: [34, 99],
      }),
    ).resolves.toEqual(sampleCreatedTaskResponse);
    await expect(
      client.updateMeeting(47202185, {
        meeting_id: 47202185,
        title: "Updated meeting title",
        updated_by: 453,
        attendee_users: [34, 99],
        do_not_send_calendar_invites: true,
      }),
    ).resolves.toEqual(sampleMeetingSearchResponse.data[0]);
    await expect(
      client.updateNote(66752552, {
        note_id: 66752552,
        description: "<p>Updated note</p>",
        updated_by: 453,
        collaborator_user_ids: [34, 99],
      }),
    ).resolves.toEqual(sampleCreatedNoteResponse);
    await expect(
      client.updateCallLog(498700, {
        call_log_id: 498700,
        call_notes: "Updated call notes",
        duration: "120",
        updated_by: 453,
      }),
    ).resolves.toEqual(sampleCreatedCallLogResponse);
    expect(transport).toHaveBeenCalledTimes(4);
  });

  it("parses candidate job assignment hiring stage history payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleCandidateJobAssignmentHiringStageHistoryResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getCandidateJobAssignmentHiringStageHistory("candidate-related-sample-001");

    expect(result).toEqual(sampleCandidateJobAssignmentHiringStageHistoryResponse);
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.objectContaining({
          pathname: "/v1/candidates/candidate-related-sample-001/history",
        }),
      }),
    );
  });

  it("keeps invalid payload errors generic when debug logging is disabled", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        data: [
          {
            slug: "010011",
            position: { title: "bad-type" },
          },
        ],
      }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.searchCandidates({ first_name: "Sample" })).rejects.toMatchObject({
      message: expect.stringContaining("Recruit CRM API returned an unexpected response shape"),
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("logs compact schema issues when debug logging is enabled", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify({
        current_page: 1,
        data: [
          {
            slug: "010011",
            position: { title: "bad-type" },
          },
        ],
      }),
    }));
    const client = new RecruitCrmClient({ ...baseConfig, debugSchemaErrors: true }, transport);

    await expect(client.searchCandidates({ first_name: "Sample" })).rejects.toMatchObject({
      message: expect.stringContaining("Recruit CRM API returned an unexpected response shape"),
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Recruit CRM schema mismatch for /candidates/search"),
    );
  });

  it("parses custom-field metadata without validating unused fields", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify([
        {
          field_id: "34",
          field_type: "dropdown",
          field_name: "Category",
          default_value: { unexpected: true },
          unused_metadata: {
            nested: true,
          },
        },
      ]),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getCandidateCustomFields();

    expect(result).toEqual([
      {
        field_id: 34,
        field_type: "dropdown",
        field_name: "Category",
        default_value: { unexpected: true },
        unused_metadata: {
          nested: true,
        },
      },
    ]);
  });

  it("getCustomFields calls /v1/custom-fields and parses the response", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toMatch(/\/custom-fields$/);
      return {
        statusCode: 200,
        bodyText: JSON.stringify([
          {
            field_id: "10",
            entity_type: "candidate",
            field_type: "text",
            field_name: "Notes",
            default_value: "",
          },
          {
            field_id: "20",
            entity_type: "contact",
            field_type: "dropdown",
            field_name: "Tier",
            default_value: "Gold,Silver,Bronze",
          },
        ]),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getCustomFields();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ field_id: 10, entity_type: "candidate", field_name: "Notes" });
    expect(result[1]).toMatchObject({ field_id: 20, entity_type: "contact", field_name: "Tier" });
  });

  it("normalises empty-array dependency responses to an empty dependency list", async () => {
    // The API returns [] (not {}) when a field has no dependencies — e.g. contacts field_id=12
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/nested-custom-fields");
      expect(["contacts", "deals"]).toContain(request.url.searchParams.get("entity_type"));
      expect(["12", "2"]).toContain(request.url.searchParams.get("field_id"));

      return {
        statusCode: 200,
        bodyText: JSON.stringify([]),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const contactResult = await client.getCustomFieldDependencies("contacts", 12);
    const dealResult = await client.getCustomFieldDependencies("deals", 2);

    expect(contactResult).toMatchObject({
      entity_type: "contacts",
      dependency_count: 0,
      dependencies: [],
    });
    expect(dealResult).toMatchObject({
      entity_type: "deals",
      dependency_count: 0,
      dependencies: [],
    });
  });

  it("parses direct candidate detail payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleCandidateDetailResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getCandidateDetails("candidate-detail-sample-001");

    expect(result.slug).toBe("candidate-detail-sample-001");
    expect(result.current_salary).toBe(0);
    expect(result.resume).toEqual({
      filename: "Sample Resume.pdf",
      file_link: "https://api.recruitcrm.io/v1/candidates/candidate-detail-sample-001/resume/example",
    });
    expect(result.salary_type).toEqual({
      id: "2",
      label: "Annual Salary",
    });
    expect(result.custom_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_id: 34,
          field_name: "Tech Stack",
        }),
      ]),
    );
    expect(result.work_history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Founder",
          work_company_name: "Acme Foods",
        }),
      ]),
    );
    expect(result.education_history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          institute_name: "Example Institute of Technology",
        }),
      ]),
    );
  });

  it("parses direct job detail payloads", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleJobDetailResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getJobDetails("job-detail-sample-001");

    expect(result.slug).toBe("job-detail-sample-001");
    expect(result.salary_type).toEqual({
      id: 2,
      label: "Annual Salary",
    });
    expect(result.custom_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_id: 1,
          field_name: "Region",
        }),
      ]),
    );
    expect(result.job_questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          question: "Why this role?",
        }),
      ]),
    );
    expect(result.resource_url).toBe("https://app.recruitcrm.io/job/job-detail-sample-001");
  });

  it("accepts null secondary_contact_slugs in job detail payloads", async () => {
    const payload = {
      ...sampleJobDetailResponse,
      slug: "job-null-secondary-001",
      secondary_contact_slugs: null,
    };

    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(payload),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getJobDetails("job-null-secondary-001");

    expect(result.slug).toBe("job-null-secondary-001");
    expect(result.secondary_contact_slugs).toBeNull();
  });

  it("parses direct company detail payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/companies/company-detail-sample-001");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCompanyDetailResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getCompanyDetails("company-detail-sample-001");

    expect(result.slug).toBe("company-detail-sample-001");
    expect(result.company_name).toBe("Example Holdings");
    expect(result.contact_slug).toEqual(["contact-sample-001", "", null, "contact-sample-002"]);
    expect(result.custom_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_id: 1,
          field_name: "Parent Organization",
        }),
      ]),
    );
    expect(result.resource_url).toBe("https://app.recruitcrm.io/company/company-detail-sample-001");
  });

  it("parses direct contact detail payloads", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts/contact-detail-sample-001");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleContactDetailResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const result = await client.getContactDetails("contact-detail-sample-001");

    expect(result.slug).toBe("contact-detail-sample-001");
    expect(result.company_name).toBe("Example Holdings");
    expect(result.additional_company_slugs).toEqual(["company-sample-aux-001", "", null]);
    expect(result.custom_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_id: 1,
          field_name: "Department",
        }),
      ]),
    );
    expect(result.resource_url).toBe("https://app.recruitcrm.io/contact/contact-detail-sample-001");
  });

  it("maps direct detail 404s to candidate not found", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({ message: "Not found" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.getCandidateDetails("missing")).rejects.toMatchObject({
      message: expect.stringMatching(/^Candidate not found\./),
    });
  });

  it("maps direct job detail 404s to job not found", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({ message: "Not found" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.getJobDetails("missing-job")).rejects.toMatchObject({
      message: expect.stringMatching(/^Job not found\./),
    });
  });

  it("maps direct company detail 404s to company not found", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({ message: "Not found" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.getCompanyDetails("missing-company")).rejects.toMatchObject({
      message: expect.stringMatching(/^Company not found\./),
    });
  });

  it("maps direct contact detail 404s to contact not found", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 404,
      bodyText: JSON.stringify({ message: "Not found" }),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    await expect(client.getContactDetails("missing-contact")).rejects.toMatchObject({
      message: expect.stringMatching(/^Contact not found\./),
    });
  });

  it("logs compact schema issues for direct detail payloads when debug logging is enabled", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(["not-an-object"]),
    }));
    const client = new RecruitCrmClient({ ...baseConfig, debugSchemaErrors: true }, transport);

    await expect(client.getCandidateDetails("candidate-detail-sample-001")).rejects.toMatchObject({
      message: expect.stringContaining("Recruit CRM API returned an unexpected response shape"),
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Recruit CRM schema mismatch for /candidates/candidate-detail-sample-001: <root>:"),
    );
  });

  it("logs compact schema issues for direct company detail payloads when debug logging is enabled", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(["not-an-object"]),
    }));
    const client = new RecruitCrmClient({ ...baseConfig, debugSchemaErrors: true }, transport);

    await expect(client.getCompanyDetails("company-detail-sample-001")).rejects.toMatchObject({
      message: expect.stringContaining("Recruit CRM API returned an unexpected response shape"),
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Recruit CRM schema mismatch for /companies/company-detail-sample-001: <root>:"),
    );
  });

  it("logs compact schema issues for direct contact detail payloads when debug logging is enabled", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(["not-an-object"]),
    }));
    const client = new RecruitCrmClient({ ...baseConfig, debugSchemaErrors: true }, transport);

    await expect(client.getContactDetails("contact-detail-sample-001")).rejects.toMatchObject({
      message: expect.stringContaining("Recruit CRM API returned an unexpected response shape"),
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Recruit CRM schema mismatch for /contacts/contact-detail-sample-001: <root>:"),
    );
  });
});

describe("executeGetCandidateDetails", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a batch envelope for a single slug", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, first_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCandidateDetails } = await import("../src/server.js");
    const result = await executeGetCandidateDetails(client, {
      candidate_slugs: ["slug-a"],
    });

    expect(result).toMatchObject({
      requested_count: 1,
      successful_count: 1,
      failed_count: 0,
      errors: [],
      candidates: [expect.objectContaining({ slug: "slug-a" })],
    });
  });

  it("returns a result entry for each unique slug on the success path", async () => {
    const seen: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      seen.push(slug);
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, first_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCandidateDetails } = await import("../src/server.js");
    const result = await executeGetCandidateDetails(client, {
      candidate_slugs: ["slug-a", "slug-b", "slug-c"],
    });

    expect(result).toMatchObject({
      requested_count: 3,
      successful_count: 3,
      failed_count: 0,
      errors: [],
    });
    expect(result.candidates).toHaveLength(3);
    expect(seen.sort()).toEqual(["slug-a", "slug-b", "slug-c"]);
  });

  it("surfaces partial failures with status_code from the API error", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      if (slug === "bad-slug") {
        return { statusCode: 404, bodyText: JSON.stringify({ message: "Not found" }) };
      }
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, first_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCandidateDetails } = await import("../src/server.js");
    const result = await executeGetCandidateDetails(client, {
      candidate_slugs: ["slug-a", "bad-slug", "slug-c"],
    });

    expect(result.requested_count).toBe(3);
    expect(result.successful_count).toBe(2);
    expect(result.failed_count).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({
      slug: "bad-slug",
      status_code: 404,
    });
    expect(result.errors[0].error).toMatch(/Candidate not found/i);
  });

  it("deduplicates input slugs before fan-out", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCandidateDetails } = await import("../src/server.js");
    const result = await executeGetCandidateDetails(client, {
      candidate_slugs: ["slug-a", "slug-a", "slug-b"],
    });

    expect(transport).toHaveBeenCalledTimes(2);
    expect(result.requested_count).toBe(2);
    expect(result.successful_count).toBe(2);
  });
});

describe("executeGetContactDetails", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a result entry for each unique slug on the success path", async () => {
    const seen: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      seen.push(slug);
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, first_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetContactDetails } = await import("../src/server.js");
    const result = await executeGetContactDetails(client, {
      contact_slugs: ["slug-a", "slug-b", "slug-c"],
    });

    expect(result).toMatchObject({
      requested_count: 3,
      successful_count: 3,
      failed_count: 0,
      errors: [],
    });
    expect(result.contacts).toHaveLength(3);
    expect(seen.sort()).toEqual(["slug-a", "slug-b", "slug-c"]);
  });

  it("surfaces partial failures with status_code from the API error", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      if (slug === "bad-slug") {
        return { statusCode: 404, bodyText: JSON.stringify({ message: "Not found" }) };
      }
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, first_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetContactDetails } = await import("../src/server.js");
    const result = await executeGetContactDetails(client, {
      contact_slugs: ["slug-a", "bad-slug", "slug-c"],
    });

    expect(result.requested_count).toBe(3);
    expect(result.successful_count).toBe(2);
    expect(result.failed_count).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({
      slug: "bad-slug",
      status_code: 404,
    });
    expect(result.errors[0].error).toMatch(/Contact not found/i);
  });

  it("deduplicates input slugs before fan-out", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetContactDetails } = await import("../src/server.js");
    const result = await executeGetContactDetails(client, {
      contact_slugs: ["slug-a", "slug-a", "slug-b"],
    });

    expect(transport).toHaveBeenCalledTimes(2);
    expect(result.requested_count).toBe(2);
    expect(result.successful_count).toBe(2);
  });
});

describe("executeGetCompanyDetails", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a batch envelope for a single slug", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, company_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCompanyDetails } = await import("../src/server.js");
    const result = await executeGetCompanyDetails(client, {
      company_slugs: ["slug-a"],
    });

    expect(result).toMatchObject({
      requested_count: 1,
      successful_count: 1,
      failed_count: 0,
      errors: [],
      companies: [expect.objectContaining({ slug: "slug-a" })],
    });
  });

  it("returns a result entry for each unique slug on the success path", async () => {
    const seen: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      seen.push(slug);
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, company_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCompanyDetails } = await import("../src/server.js");
    const result = await executeGetCompanyDetails(client, {
      company_slugs: ["slug-a", "slug-b", "slug-c"],
    });

    expect(result).toMatchObject({
      requested_count: 3,
      successful_count: 3,
      failed_count: 0,
      errors: [],
    });
    expect(result.companies).toHaveLength(3);
    expect(seen.sort()).toEqual(["slug-a", "slug-b", "slug-c"]);
  });

  it("surfaces partial failures with status_code from the API error", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      if (slug === "bad-slug") {
        return { statusCode: 404, bodyText: JSON.stringify({ message: "Not found" }) };
      }
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug, company_name: `name-${slug}` }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCompanyDetails } = await import("../src/server.js");
    const result = await executeGetCompanyDetails(client, {
      company_slugs: ["slug-a", "bad-slug", "slug-c"],
    });

    expect(result.requested_count).toBe(3);
    expect(result.successful_count).toBe(2);
    expect(result.failed_count).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({
      slug: "bad-slug",
      status_code: 404,
    });
    expect(result.errors[0].error).toMatch(/Company not found/i);
  });

  it("deduplicates input slugs before fan-out", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = request.url.pathname.split("/").pop() ?? "";
      return {
        statusCode: 200,
        bodyText: JSON.stringify({ slug }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeGetCompanyDetails } = await import("../src/server.js");
    const result = await executeGetCompanyDetails(client, {
      company_slugs: ["slug-a", "slug-a", "slug-b"],
    });

    expect(transport).toHaveBeenCalledTimes(2);
    expect(result.requested_count).toBe(2);
    expect(result.successful_count).toBe(2);
  });
});

describe("executeCreateHotlist", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns normalized create_hotlist output", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 200,
      bodyText: JSON.stringify(sampleCreatedHotlistResponse),
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateHotlist } = await import("../src/server.js");
    const result = await executeCreateHotlist(client, {
      name: "Product Leaders",
      related_to_type: "candidate",
      shared: 0,
      created_by: 453,
    });

    expect(result).toEqual({
      hotlist_id: 307309,
      name: "Product Leaders",
      related_to_type: "candidate",
      shared: false,
      created_by: 453,
    });
  });
});

describe("executeCreateCandidate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("checks duplicates, creates the candidate, then creates work and education history", async () => {
    const seenPaths: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      seenPaths.push(request.url.pathname);

      if (request.url.pathname.endsWith("/candidates/search")) {
        expect(request.url.searchParams.get("email")).toBe("create.candidate@example.com");
        expect(request.url.searchParams.get("exact_search")).toBe("true");
        return {
          statusCode: 200,
          bodyText: JSON.stringify([]),
        };
      }

      if (request.url.pathname.endsWith("/candidates")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toMatchObject({
          first_name: "Create",
          last_name: "Candidate",
          email: "create.candidate@example.com",
          owner_id: 453,
          created_by: 453,
        });
        expect(request.jsonBody).not.toHaveProperty("work_history");
        expect(request.jsonBody).not.toHaveProperty("education_history");
        expect(request.jsonBody).not.toHaveProperty("existing_candidate_slug");

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCreatedCandidateResponse),
        };
      }

      if (request.url.pathname.endsWith("/candidates/work-history/create")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual([
          {
            candidate_slug: "candidate-created-sample-001",
            title: "Senior Engineer",
            work_company_name: "Acme Labs",
          },
        ]);

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCandidateHistoryCreateResponse),
        };
      }

      if (request.url.pathname.endsWith("/candidates/education-history/create")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toEqual([
          {
            candidate_slug: "candidate-created-sample-001",
            institute_name: "Example Institute",
          },
        ]);

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCandidateHistoryCreateResponse),
        };
      }

      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateCandidate } = await import("../src/server.js");
    const result = await executeCreateCandidate(client, {
      first_name: "Create",
      last_name: "Candidate",
      email: "create.candidate@example.com",
      owner_id: 453,
      created_by: 453,
      work_history: [
        {
          title: "Senior Engineer",
          work_company_name: "Acme Labs",
        },
      ],
      education_history: [
        {
          institute_name: "Example Institute",
        },
      ],
    });

    expect(seenPaths).toEqual([
      "/v1/candidates/search",
      "/v1/candidates",
      "/v1/candidates/work-history/create",
      "/v1/candidates/education-history/create",
    ]);
    expect(result).toMatchObject({
      action: "created",
      candidate_slug: "candidate-created-sample-001",
      candidate_id: 46197,
      view_url: "https://app.recruitcrm.io/candidate/candidate-created-sample-001",
      work_history: {
        requested_count: 1,
        successful: true,
        status_code: 200,
      },
      education_history: {
        requested_count: 1,
        successful: true,
        status_code: 200,
      },
      errors: [],
    });
  });

  it("blocks candidate creation when duplicate search finds a match", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/candidates/search");
      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          current_page: 1,
          next_page_url: null,
          data: [
            {
              slug: "candidate-duplicate-sample-001",
              first_name: "Existing",
              last_name: "Candidate",
            },
          ],
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateCandidate } = await import("../src/server.js");
    await expect(
      executeCreateCandidate(client, {
        first_name: "Create",
        last_name: "Candidate",
        email: "duplicate@example.com",
        owner_id: 453,
        created_by: 453,
      }),
    ).rejects.toThrow(/Potential duplicate candidate found/);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("updates an existing candidate with update_candidate executor", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/candidates/candidate-duplicate-sample-001");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).toMatchObject({
        first_name: "Existing",
        last_name: "Candidate",
        updated_by: 453,
      });
      expect(request.jsonBody).not.toHaveProperty("existing_candidate_slug");
      expect(request.jsonBody).not.toHaveProperty("candidate_slug");

      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          ...sampleCreatedCandidateResponse,
          slug: "candidate-duplicate-sample-001",
          first_name: "Existing",
          last_name: "Candidate",
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeUpdateCandidate } = await import("../src/server.js");
    const result = await executeUpdateCandidate(client, {
      candidate_slug: "candidate-duplicate-sample-001",
      first_name: "Existing",
      last_name: "Candidate",
      updated_by: 453,
    });

    expect(result).toMatchObject({
      action: "updated",
      candidate_slug: "candidate-duplicate-sample-001",
      work_history: {
        requested_count: 0,
        successful: true,
      },
      education_history: {
        requested_count: 0,
        successful: true,
      },
    });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("passes base64 resume string to the API without URL normalization", async () => {
    const base64Resume = "A".repeat(100); // >50 chars, all base64 chars

    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/candidates/search")) {
        return { statusCode: 200, bodyText: JSON.stringify([]) };
      }
      if (request.url.pathname.endsWith("/candidates")) {
        expect(request.method).toBe("POST");
        expect((request.jsonBody as Record<string, unknown>).resume).toBe(base64Resume);
        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedCandidateResponse) };
      }
      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateCandidate } = await import("../src/server.js");
    await executeCreateCandidate(client, {
      first_name: "Base64",
      last_name: "Resume",
      owner_id: 453,
      created_by: 453,
      resume: base64Resume,
    });
  });

  it("prepends https:// to a bare resume URL", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/candidates/search")) {
        return { statusCode: 200, bodyText: JSON.stringify([]) };
      }
      if (request.url.pathname.endsWith("/candidates")) {
        expect((request.jsonBody as Record<string, unknown>).resume).toBe("https://example.com/resume.pdf");
        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedCandidateResponse) };
      }
      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateCandidate } = await import("../src/server.js");
    await executeCreateCandidate(client, {
      first_name: "URL",
      last_name: "Resume",
      owner_id: 453,
      created_by: 453,
      resume: "example.com/resume.pdf",
    });
  });

  it("passes a file-type custom field URL to the API unchanged", async () => {
    const fileUrl = "https://example.com/formatted-cv.pdf";

    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      if (request.url.pathname.endsWith("/candidates/search")) {
        return { statusCode: 200, bodyText: JSON.stringify([]) };
      }
      if (request.url.pathname.endsWith("/candidates")) {
        expect(request.jsonBody).toMatchObject({
          custom_fields: [{ field_id: 1, value: fileUrl }],
        });
        return { statusCode: 200, bodyText: JSON.stringify(sampleCreatedCandidateResponse) };
      }
      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateCandidate } = await import("../src/server.js");
    await executeCreateCandidate(client, {
      first_name: "FileField",
      last_name: "Test",
      owner_id: 453,
      created_by: 453,
      custom_fields: [{ field_id: 1, value: fileUrl }],
    });
  });
});

describe("executeCreateTask", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates the task type before creating and returns compact output", async () => {
    const seenPaths: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      seenPaths.push(request.url.pathname);

      if (request.url.pathname.endsWith("/task-types")) {
        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleTaskTypeListResponse),
        };
      }

      if (request.url.pathname.endsWith("/tasks")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toMatchObject({
          task_type_id: 332,
          title: "Follow up call",
          description: "<p><strong>Rich task</strong></p>",
          reminder: 30,
          start_date: "2026-04-28T04:30:00.000000Z",
          owner_id: 453,
          created_by: 453,
          related_to: "candidate-related-sample-001",
          related_to_type: "candidate",
        });

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCreatedTaskResponse),
        };
      }

      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateTask } = await import("../src/server.js");
    const result = await executeCreateTask(client, {
      task_type_id: 332,
      title: "Follow up call",
      description: "<p><strong>Rich task</strong></p>",
      reminder: 30,
      start_date: "2026-04-28T04:30:00.000000Z",
      owner_id: 453,
      created_by: 453,
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
    });

    expect(seenPaths).toEqual(["/v1/task-types", "/v1/tasks"]);
    expect(result).toMatchObject({
      task_id: 66753909,
      task_type: {
        id: 332,
        label: "Follow up",
      },
      title: "Codex API test task",
      description: sampleCreatedTaskResponse.description,
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
      related_to_view_url: "https://app.recruitcrm.io/candidate/candidate-related-sample-001",
      owner: 453,
      created_by: 453,
      updated_by: 453,
    });
    expect(result).not.toHaveProperty("related");
  });
});

describe("executeCreateNote", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates the note type before creating and returns compact output", async () => {
    const seenPaths: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      seenPaths.push(request.url.pathname);

      if (request.url.pathname.endsWith("/note-types")) {
        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleNoteTypeListResponse),
        };
      }

      if (request.url.pathname.endsWith("/notes")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toMatchObject({
          note_type_id: 108871,
          description: "<p><strong>Rich text</strong></p>",
          related_to: "candidate-related-sample-001",
          related_to_type: "candidate",
          created_by: 453,
        });

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCreatedNoteResponse),
        };
      }

      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateNote } = await import("../src/server.js");
    const result = await executeCreateNote(client, {
      note_type_id: 108871,
      description: "<p><strong>Rich text</strong></p>",
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
      created_by: 453,
    });

    expect(seenPaths).toEqual(["/v1/note-types", "/v1/notes"]);
    expect(result).toMatchObject({
      note_id: 66752552,
      note_type: {
        id: 108871,
        label: "General Note",
      },
      description: sampleCreatedNoteResponse.description,
      related_to: "candidate-related-sample-001",
      related_to_type: "candidate",
      created_by: 453,
      updated_by: 453,
    });
    expect(result).not.toHaveProperty("related");
  });
});

describe("executeAddRecordsToHotlist", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a stable batch envelope for a single slug", async () => {
    const transport = vi.fn(async (_request: HttpRequestOptions): Promise<HttpResponse> => ({
      statusCode: 204,
      bodyText: "",
    }));
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeAddRecordsToHotlist } = await import("../src/server.js");
    const result = await executeAddRecordsToHotlist(client, {
      hotlist_id: 702,
      related_slugs: ["slug-a"],
    });

    expect(result).toEqual({
      hotlist_id: 702,
      requested_count: 1,
      successful_count: 1,
      failed_count: 0,
      added_slugs: ["slug-a"],
      errors: [],
    });
  });

  it("executes sequentially, deduplicates input, and preserves partial failures", async () => {
    const callOrder: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      const slug = String((request.jsonBody as { related: string }).related);
      callOrder.push(slug);

      if (slug === "bad-slug") {
        return {
          statusCode: 422,
          bodyText: JSON.stringify({ message: "Slug rejected" }),
        };
      }

      return {
        statusCode: 200,
        bodyText: JSON.stringify({ ok: true }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeAddRecordsToHotlist } = await import("../src/server.js");
    const result = await executeAddRecordsToHotlist(client, {
      hotlist_id: 702,
      related_slugs: ["slug-a", "slug-a", "bad-slug", "slug-b"],
    });

    expect(callOrder).toEqual(["slug-a", "bad-slug", "slug-b"]);
    expect(result).toMatchObject({
      hotlist_id: 702,
      requested_count: 3,
      successful_count: 2,
      failed_count: 1,
      added_slugs: ["slug-a", "slug-b"],
      errors: [
        {
          slug: "bad-slug",
          status_code: 422,
          error: expect.stringContaining("validation error"),
        },
      ],
    });
    expect(transport).toHaveBeenCalledTimes(3);
  });

  it("includes custom_fields in the JSON body for buildSearchJobsRequest", () => {
    const result = buildSearchJobsRequest({
      name: "Director",
      custom_fields: [
        { field_id: 40, filter_type: "equals", filter_value: "Placed" },
        { field_id: 14, filter_type: "not_available" },
      ],
    });

    expect(result.query?.get("name")).toBe("Director");
    expect(result.jsonBody).toEqual({
      custom_fields: [
        { field_id: 40, filter_type: "equals", filter_value: "Placed" },
        { field_id: 14, filter_type: "not_available" },
      ],
    });
  });

  it("omits jsonBody from buildSearchJobsRequest when no custom_fields are provided", () => {
    const result = buildSearchJobsRequest({ name: "Analyst" });

    expect(result.query?.get("name")).toBe("Analyst");
    expect(result.jsonBody).toBeUndefined();
  });

  it("includes custom_fields in the JSON body for buildSearchCompaniesRequest", () => {
    const result = buildSearchCompaniesRequest({
      company_name: "Acme",
      custom_fields: [{ field_id: 2, filter_type: "yes" }],
    });

    expect(result.query?.get("company_name")).toBe("Acme");
    expect(result.jsonBody).toEqual({
      custom_fields: [{ field_id: 2, filter_type: "yes" }],
    });
  });

  it("omits jsonBody from buildSearchCompaniesRequest when no custom_fields are provided", () => {
    const result = buildSearchCompaniesRequest({ company_name: "Acme" });

    expect(result.query?.get("company_name")).toBe("Acme");
    expect(result.jsonBody).toBeUndefined();
  });

  it("includes custom_fields in the JSON body for buildSearchContactsRequest", () => {
    const result = buildSearchContactsRequest({
      first_name: "Jane",
      custom_fields: [{ field_id: 12, filter_type: "equals", filter_value: "Auto" }],
    });

    expect(result.query?.get("first_name")).toBe("Jane");
    expect(result.jsonBody).toEqual({
      custom_fields: [{ field_id: 12, filter_type: "equals", filter_value: "Auto" }],
    });
  });

  it("omits jsonBody from buildSearchContactsRequest when no custom_fields are provided", () => {
    const result = buildSearchContactsRequest({ first_name: "Jane" });

    expect(result.query?.get("first_name")).toBe("Jane");
    expect(result.jsonBody).toBeUndefined();
  });

  it("sets limit and page in query for buildSearchCandidatesRequest", () => {
    const result = buildSearchCandidatesRequest({ first_name: "Alice", limit: 10, page: 3 });

    expect(result.query?.get("first_name")).toBe("Alice");
    expect(result.query?.get("limit")).toBe("10");
    expect(result.query?.get("page")).toBe("3");
  });

  it("defaults limit to 100 and page to 1 for buildSearchCandidatesRequest when not provided", () => {
    const result = buildSearchCandidatesRequest({ first_name: "Alice" });

    expect(result.query?.get("limit")).toBe("100");
    expect(result.query?.get("page")).toBe("1");
  });

  it("passes limit and page in query for buildSearchCompaniesRequest", () => {
    const result = buildSearchCompaniesRequest({ company_name: "Acme", limit: 5, page: 2 });

    expect(result.query?.get("limit")).toBe("5");
    expect(result.query?.get("page")).toBe("2");
  });

  it("defaults limit to 100 and page to 1 for buildSearchCompaniesRequest when not provided", () => {
    const result = buildSearchCompaniesRequest({ company_name: "Acme" });

    expect(result.query?.get("limit")).toBe("100");
    expect(result.query?.get("page")).toBe("1");
  });

  it("passes limit and page in query for buildSearchContactsRequest", () => {
    const result = buildSearchContactsRequest({ first_name: "Jane", limit: 7, page: 4 });

    expect(result.query?.get("limit")).toBe("7");
    expect(result.query?.get("page")).toBe("4");
  });

  it("defaults limit to 100 and page to 1 for buildSearchContactsRequest when not provided", () => {
    const result = buildSearchContactsRequest({ first_name: "Jane" });

    expect(result.query?.get("limit")).toBe("100");
    expect(result.query?.get("page")).toBe("1");
  });
});

describe("executeCreateContact", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("checks duplicates then creates the contact when no duplicates exist", async () => {
    const seenPaths: string[] = [];
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      seenPaths.push(request.url.pathname);

      if (request.url.pathname.endsWith("/contacts/search")) {
        expect(request.url.searchParams.get("email")).toBe("create.contact@example.com");
        expect(request.url.searchParams.get("exact_search")).toBe("true");
        return {
          statusCode: 200,
          bodyText: JSON.stringify({ current_page: 1, next_page_url: null, data: [] }),
        };
      }

      if (request.url.pathname.endsWith("/contacts")) {
        expect(request.method).toBe("POST");
        expect(request.jsonBody).toMatchObject({
          first_name: "Jane",
          last_name: "Smith",
          email: "create.contact@example.com",
          owner_id: 453,
          created_by: 453,
        });
        expect(request.jsonBody).not.toHaveProperty("allow_duplicate");
        expect(request.jsonBody).not.toHaveProperty("contact_slug");

        return {
          statusCode: 200,
          bodyText: JSON.stringify(sampleCreatedContactResponse),
        };
      }

      throw new Error(`Unexpected request: ${request.url.toString()}`);
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateContact } = await import("../src/server.js");
    const result = await executeCreateContact(client, {
      first_name: "Jane",
      last_name: "Smith",
      email: "create.contact@example.com",
      owner_id: 453,
      created_by: 453,
    });

    expect(seenPaths).toEqual(["/v1/contacts/search", "/v1/contacts"]);
    expect(result).toMatchObject({
      action: "created",
      contact_slug: "contact-created-sample-001",
      contact_id: 20591,
      view_url: "https://app.recruitcrm.io/contact/contact-created-sample-001",
    });
  });

  it("blocks contact creation when duplicate search finds a match", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts/search");
      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          current_page: 1,
          next_page_url: null,
          data: [
            {
              slug: "contact-duplicate-sample-001",
              first_name: "Existing",
              last_name: "Contact",
              id: 99999,
            },
          ],
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateContact } = await import("../src/server.js");
    await expect(
      executeCreateContact(client, {
        first_name: "Jane",
        last_name: "Smith",
        email: "duplicate.contact@example.com",
        owner_id: 453,
        created_by: 453,
      }),
    ).rejects.toThrow(/Potential duplicate contact found/);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("blocks contact creation when duplicate search finds a match on linkedin", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts/search");
      expect(request.url.searchParams.get("linkedin")).toBe("https://linkedin.com/in/existing-contact");
      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          current_page: 1,
          next_page_url: null,
          data: [
            {
              slug: "contact-duplicate-linkedin-001",
              first_name: "Existing",
              last_name: "Contact",
              id: 88888,
            },
          ],
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateContact } = await import("../src/server.js");
    await expect(
      executeCreateContact(client, {
        first_name: "Jane",
        last_name: "Smith",
        linkedin: "https://linkedin.com/in/existing-contact",
        owner_id: 453,
        created_by: 453,
      }),
    ).rejects.toThrow(/Potential duplicate contact found/);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("blocks contact creation when duplicate search finds a match on contact number", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts/search");
      expect(request.url.searchParams.get("contact_number")).toBe("+1-555-0120");
      return {
        statusCode: 200,
        bodyText: JSON.stringify({
          current_page: 1,
          next_page_url: null,
          data: [
            {
              slug: "contact-duplicate-phone-001",
              first_name: "Existing",
              last_name: "Contact",
              id: 77777,
            },
          ],
        }),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateContact } = await import("../src/server.js");
    await expect(
      executeCreateContact(client, {
        first_name: "Jane",
        last_name: "Smith",
        contact_number: "+1-555-0120",
        owner_id: 453,
        created_by: 453,
      }),
    ).rejects.toThrow(/Potential duplicate contact found/);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("skips duplicate check and creates when allow_duplicate is true", async () => {
    const transport = vi.fn(async (request: HttpRequestOptions): Promise<HttpResponse> => {
      expect(request.url.pathname).toBe("/v1/contacts");
      expect(request.method).toBe("POST");
      expect(request.jsonBody).not.toHaveProperty("allow_duplicate");

      return {
        statusCode: 200,
        bodyText: JSON.stringify(sampleCreatedContactResponse),
      };
    });
    const client = new RecruitCrmClient(baseConfig, transport);

    const { executeCreateContact } = await import("../src/server.js");
    const result = await executeCreateContact(client, {
      first_name: "Jane",
      last_name: "Smith",
      email: "create.contact@example.com",
      owner_id: 453,
      created_by: 453,
      allow_duplicate: true,
    });

    expect(transport).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      action: "created",
      contact_slug: "contact-created-sample-001",
    });
  });
});
