import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  treatment?: string;
  preferred_time?: string;
  message?: string;
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  return {
    supabaseUrl,
    serviceRoleKey,
    missing: [
      !supabaseUrl ? "SUPABASE_URL" : null,
      !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
    ].filter(Boolean),
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  const lead = {
    name: payload.name?.trim(),
    phone: payload.phone?.trim(),
    treatment: payload.treatment?.trim(),
    preferred_time: payload.preferred_time?.trim(),
    message: payload.message?.trim() || null,
  };

  if (!lead.name || !lead.phone || !lead.treatment || !lead.preferred_time) {
    return NextResponse.json(
      { error: "Name, phone, treatment, and preferred time are required." },
      { status: 400 },
    );
  }

  const config = getSupabaseConfig();

  if (!config.supabaseUrl || !config.serviceRoleKey) {
    return NextResponse.json(
      { error: `Missing Supabase setting: ${config.missing.join(", ")}. Restart the app after editing .env.local.` },
      { status: 500 },
    );
  }

  const response = await fetch(`${config.supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const details = await response.text();

    return NextResponse.json(
      {
        error: "Could not save lead to Supabase.",
        details,
      },
      { status: response.status },
    );
  }

  const [savedLead] = await response.json();

  return NextResponse.json({ lead: savedLead }, { status: 201 });
}
