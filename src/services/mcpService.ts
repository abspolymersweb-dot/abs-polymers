import { McpToolDefinition } from '@/types';
import { MACHINERY_PRODUCTS } from '@/data/machinery';

export interface McpConnectionStatus {
  isConfigured: boolean;
  endpointUrl: string;
  authHeaderConfigured: boolean;
  lastPingTimestamp?: string;
  status: 'connected' | 'unconfigured' | 'unreachable';
  message: string;
  registeredTools: McpToolDefinition[];
}

export interface McpSearchRequest {
  query: string;
  category?: string;
  maxResults?: number;
}

export interface McpSpecRequest {
  modelNumber: string;
  productSlug?: string;
}

export interface McpInquiryAnalysisRequest {
  inquiryId: string;
  rawText: string;
  extractedParameters?: Record<string, string>;
}

export interface McpInquiryAnalysisResult {
  suggestedAction: string;
  urgency: 'high' | 'medium' | 'low';
  matchingProducts: string[];
  recommendedModelCapacity: string;
  suggestedFollowUpEmail: string;
}

export interface McpBlogDraftRequest {
  topic: string;
  targetKeyword: string;
  targetAudience: string;
  targetLocation: string;
}

export interface McpBlogDraftResponse {
  titleSuggestions: string[];
  outline: string[];
  metaDescription: string;
  suggestedHeadings: string[];
}

// Built-in tool definitions for future approved MCP capabilities
export const APPROVED_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'search_machinery_catalogue',
    description: 'Searches ABS Polymers verified machinery catalogue by keyword, polymer type, or throughput.',
    parametersSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or application requirement' },
        category: { type: 'string', description: 'Category filter e.g. washing-plants, crushers' }
      },
      required: ['query']
    },
    isAvailable: true
  },
  {
    name: 'get_model_specifications',
    description: 'Retrieves verified engineering specs, dimensions, motor ratings, and electrical requirements for any ABS Polymers model.',
    parametersSchema: {
      type: 'object',
      properties: {
        modelNumber: { type: 'string', description: 'E.g. W1000, G500, CR750, MTB1500' }
      },
      required: ['modelNumber']
    },
    isAvailable: true
  },
  {
    name: 'analyze_incoming_inquiry',
    description: 'Processes customer recycling inquiries, matches polymer feed with machinery specifications, and drafts commercial responses.',
    parametersSchema: {
      type: 'object',
      properties: {
        inquiryText: { type: 'string', description: 'Full inquiry message from customer' },
        country: { type: 'string', description: 'Customer target country' }
      },
      required: ['inquiryText']
    },
    isAvailable: true
  },
  {
    name: 'seo_content_assist',
    description: 'Analyzes article drafts against industrial search intent, keyword density, and technical veracity.',
    parametersSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        primaryKeyword: { type: 'string' }
      },
      required: ['content', 'primaryKeyword']
    },
    isAvailable: true
  }
];

export const mcpService = {
  getConnectionStatus(): McpConnectionStatus {
    const url = process.env.MCP_SERVER_URL || '';
    const hasAuth = Boolean(process.env.MCP_API_KEY || process.env.MCP_BEARER_TOKEN);

    if (!url) {
      return {
        isConfigured: false,
        endpointUrl: 'Not Configured (MCP_SERVER_URL empty)',
        authHeaderConfigured: hasAuth,
        status: 'unconfigured',
        message: 'AI / Local MCP server is not configured. Set MCP_SERVER_URL and MCP_API_KEY in your environment variables when ready to activate.',
        registeredTools: APPROVED_MCP_TOOLS
      };
    }

    return {
      isConfigured: true,
      endpointUrl: url,
      authHeaderConfigured: hasAuth,
      lastPingTimestamp: new Date().toISOString(),
      status: 'connected',
      message: 'Integration boundary active. Ready to route tool calls to external MCP agent.',
      registeredTools: APPROVED_MCP_TOOLS
    };
  },

  // Fallback local tool execution when MCP server is offline
  searchCatalogueLocally(req: McpSearchRequest) {
    const q = req.query.toLowerCase();
    const results = MACHINERY_PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = !req.category || p.category === req.category;
      const matchMat = p.compatibleMaterials.some((m) => m.toLowerCase().includes(q));
      const matchSeries = p.series.toLowerCase().includes(q);
      const matchVariant = p.variants.some((v) => v.modelNumber.toLowerCase().includes(q));
      return (matchName || matchMat || matchSeries || matchVariant) && matchCat;
    });

    return {
      query: req.query,
      count: results.length,
      products: results.map((p) => ({
        id: p.id,
        name: p.name,
        series: p.series,
        category: p.category,
        variantsAvailable: p.variants.map((v) => v.modelNumber),
        verifiedCapacities: p.variants.map((v) => `${v.modelNumber}: ${v.capacityKgHr} kg/h`)
      }))
    };
  },

  getModelSpecsLocally(modelNumber: string) {
    const cleanModel = modelNumber.trim().toUpperCase();
    for (const prod of MACHINERY_PRODUCTS) {
      const variant = prod.variants.find((v) => v.modelNumber.toUpperCase() === cleanModel);
      if (variant) {
        return {
          found: true,
          product: prod.name,
          series: prod.series,
          model: variant.modelNumber,
          capacity: `${variant.capacityKgHr} kg/h`,
          motorPower: variant.motorPower,
          voltage: variant.voltage,
          weight: variant.weightKg ? `${variant.weightKg} kg` : 'Refer to datasheet',
          dimensions: variant.dimensionsMm ? `${variant.dimensionsMm.length} × ${variant.dimensionsMm.width} × ${variant.dimensionsMm.height} mm` : 'Refer to datasheet',
          detailedSpecs: variant.specs
        };
      }
    }

    return {
      found: false,
      message: `Model ${modelNumber} not found in verified dataset (ABSW Series W250-W5000, G Series G250-G2000, CR Series CR250-CR2000, MTB Series MTB250-MTB2000).`
    };
  }
};
