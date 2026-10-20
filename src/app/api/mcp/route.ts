import { NextRequest, NextResponse } from 'next/server';
import { mcpService } from '@/services/mcpService';

export async function GET() {
  const status = mcpService.getConnectionStatus();
  return NextResponse.json({ success: true, mcp: status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'search_catalogue') {
      const results = mcpService.searchCatalogueLocally(payload || { query: '' });
      return NextResponse.json({ success: true, results });
    }

    if (action === 'get_specs') {
      const specs = mcpService.getModelSpecsLocally(payload?.modelNumber || '');
      return NextResponse.json({ success: true, specs });
    }

    return NextResponse.json({
      success: false,
      error: `Action '${action}' not supported in local adapter mode. External MCP server is required for live AI completion.`
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'MCP adapter processing failure' }, { status: 500 });
  }
}

