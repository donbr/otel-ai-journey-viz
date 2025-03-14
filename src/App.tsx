import React, { useState, useEffect, useRef } from 'react';
import { Play, AlertTriangle, ArrowRight, Database, Check, Zap, Code, Eye, Server, Search, Wrench, GitBranch } from 'lucide-react';
import * as d3 from 'd3';

const EnhancedOtelViz = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [expandedStages, setExpandedStages] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [codeSection, setCodeSection] = useState('collector');
  const flowChartRef = useRef(null);
  
  // Create D3 flow chart when component mounts or active stage changes
  useEffect(() => {
    if (flowChartRef.current) {
      createFlowChart();
    }
  }, [activeStage, flowChartRef.current]);
  
  const toggleExpand = (index) => {
    if (expandedStages.includes(index)) {
      setExpandedStages(expandedStages.filter(i => i !== index));
    } else {
      setExpandedStages([...expandedStages, index]);
    }
  };

  const stages = [
    {
      title: "Stage 1: Quick Win - Basic Setup with TraceZ",
      description: "Get immediate visibility into your AI agent's behavior with minimal setup.",
      components: ["OpenTelemetry Collector", "TraceZ Interface", "Basic Instrumentation"],
      challenges: ["Non-deterministic Behavior", "Hard-to-Debug Agents", "Unpredictable Execution"],
      outcomes: ["Basic Trace Visualization", "Agent Operation Timeline", "Simple Debugging"],
      effort: 1,
      complexity: 1,
      businessValue: 2,
      color: "#34D399", // Green
      icon: <Eye size={24} />,
      steps: [
        "Start OpenTelemetry Collector",
        "Install required packages",
        "Add instrumentation code",
        "View in TraceZ UI"
      ],
      code: {
        collector: `docker run \\
  -p 127.0.0.1:4317:4317 \\
  -p 127.0.0.1:4318:4318 \\
  -p 127.0.0.1:55679:55679 \\
  otel/opentelemetry-collector-contrib:0.121.0`,
        instrumentation: `# Import OpenTelemetry modules
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from openinference.instrumentation.smolagents import SmolagentsInstrumentor

# Configure OpenTelemetry
trace_provider = TracerProvider()
trace_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))

# Instrument SmolAgents
SmolagentsInstrumentor().instrument(tracer_provider=trace_provider)`
      }
    },
    {
      title: "Stage 2: Level Up - Custom Configuration",
      description: "Enhance your observability with custom attributes and detailed contexts.",
      components: ["Custom Configuration", "Custom Spans", "Context Attributes"],
      challenges: ["Reasoning Chain Gaps", "Missing Context", "Correlation Issues"],
      outcomes: ["Detailed Agent Insights", "Enhanced Debugging", "Better Root Cause Analysis"],
      effort: 2,
      complexity: 2,
      businessValue: 3,
      color: "#60A5FA", // Blue
      icon: <Code size={24} />,
      steps: [
        "Create custom configuration file",
        "Restart collector with custom config",
        "Add custom attributes to spans",
        "View enhanced traces"
      ],
      code: {
        collector: `# config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  debug:
    verbosity: detailed

service:
  pipelines:
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]`,
        instrumentation: `from opentelemetry import trace

# Get a tracer for your application
tracer = trace.get_tracer("my-ai-app")

# Create a custom span for important operations
with tracer.start_as_current_span("important_reasoning_step") as span:
    span.set_attribute("reasoning_approach", "chain-of-thought")
    span.set_attribute("prompt_tokens", 250)
    span.set_attribute("completion_tokens", 150)
    
    # Your important code here
    result = some_important_function()
    
    span.set_attribute("result_quality", "high")`
      }
    },
    {
      title: "Stage 3: Pro Level - Advanced Visualization",
      description: "Achieve production-grade observability with Jaeger's powerful capabilities.",
      components: ["Jaeger Integration", "Advanced Filtering", "Trace Comparison"],
      challenges: ["Complex Agent Workflows", "Production Scaling", "Stakeholder Visibility"],
      outcomes: ["Professional Visualization", "Cross-Agent Insights", "Performance Analysis"],
      effort: 3,
      complexity: 3,
      businessValue: 5,
      color: "#8B5CF6", // Purple
      icon: <Server size={24} />,
      steps: [
        "Start Jaeger",
        "Update collector configuration",
        "Restart collector with Jaeger config",
        "View traces in Jaeger UI"
      ],
      code: {
        collector: `# jaeger-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  jaeger:
    endpoint: "http://localhost:16686/api/traces"
    tls:
      insecure: true
  debug:
    verbosity: detailed

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger, debug]`,
        instrumentation: `# Advanced techniques

# 1. Track Business Metrics
from opentelemetry import metrics

meter = metrics.get_meter("my-ai-app")
task_counter = meter.create_counter("tasks_completed")

# Count completed tasks with attributes
task_counter.add(1, {"task_type": "information_retrieval", "success": True})

# 2. Create Span Events for Key Moments
from opentelemetry import trace

# Inside a traced function
current_span = trace.get_current_span()
current_span.add_event("model_response_received", {
    "tokens": 156,
    "response_time_ms": 350,
    "temperature": 0.7
})`
      }
    }
  ];

  // Create D3 visualization
  const createFlowChart = () => {
    // Clear previous chart
    d3.select(flowChartRef.current).selectAll("*").remove();
    
    const width = flowChartRef.current.clientWidth;
    const height = 220; // Increased height for better text fit
    const margin = { top: 20, right: 40, bottom: 40, left: 40 }; // Increased margins
    const innerWidth = width - margin.left - margin.right;
    
    const currentStage = stages[activeStage];
    
    // Create SVG
    const svg = d3.select(flowChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);
    
    // Define the data for the flow with more careful spacing
    const flowData = currentStage.steps.map((step, i) => {
      // Create more space between nodes for text
      const x = margin.left + (innerWidth * (i / (currentStage.steps.length - 1 || 1)));
      return {
        id: i,
        text: step,
        x: x,
        y: height / 2 - 20 // Raised position for better text fit below
      };
    });
    
    // Draw connections between steps
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);
    
    for (let i = 0; i < flowData.length - 1; i++) {
      const start = flowData[i];
      const end = flowData[i + 1];
      
      const points = [
        { x: start.x, y: start.y },
        { x: (start.x + end.x) / 2, y: start.y },
        { x: end.x, y: end.y }
      ];
      
      svg.append("path")
        .datum(points)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", currentStage.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("marker-end", "url(#arrow)");
    }
    
    // Define arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", currentStage.color);
    
    // Draw step circles
    const nodes = svg.selectAll(".node")
      .data(flowData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
    nodes.append("circle")
      .attr("r", 20)
      .attr("fill", "white")
      .attr("stroke", currentStage.color)
      .attr("stroke-width", 2);
    
    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(d => d.id + 1);
    
    // Create a group for the step labels below
    const labelGroups = nodes.append("g")
      .attr("class", "label-group")
      .attr("transform", "translate(0, 30)"); // Position labels below circles
    
    // Add step labels with better text wrapping
    labelGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "11px") // Smaller font
      .attr("fill", "#4B5563")
      .each(function(d) {
        const text = d3.select(this);
        const words = d.text.split(/\s+/);
        let line = "";
        let lineNumber = 0;
        const lineHeight = 1.2; // Line height
        let tspan = text.append("tspan")
          .attr("x", 0)
          .attr("dy", 0);
        
        // Manually wrap text with appropriate widths for each node
        // This ensures full node text is visible
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          // Create a new line if line gets too long or at key breakpoints
          if ((i > 0 && (i % 2 === 0)) || i === words.length - 1) {
            tspan.text(line);
            line = words[i] + " ";
            tspan = text.append("tspan")
              .attr("x", 0)
              .attr("dy", lineHeight + "em")
              .text(line);
            lineNumber++;
          } else {
            line = testLine;
          }
        }
      });
  };
  
  // Helper function to wrap text
  const wrap = (text, width) => {
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1;
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      let tspan = text.text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "px");
      
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "px")
            .text(word);
        }
      }
    });
  };

  const renderMetricBar = (value, maxValue = 5, color) => {
    const bars = [];
    for (let i = 0; i < maxValue; i++) {
      bars.push(
        <div
          key={i}
          className={`h-4 w-6 rounded-sm mx-px`}
          style={{ backgroundColor: i < value ? color : '#e5e7eb' }}
        />
      );
    }
    return <div className="flex">{bars}</div>;
  };

  const renderJourney = () => {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center mb-8">
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 ${
                index <= activeStage ? 'scale-110 shadow-lg' : 'opacity-70'
              }`}
              style={{ backgroundColor: stage.color }}
              onClick={() => setActiveStage(index)}
            >
              {stage.icon}
            </div>
            {index < stages.length - 1 && (
              <ArrowRight 
                className={`mx-2 transition-all duration-300 ${
                  index < activeStage ? 'text-gray-800' : 'text-gray-300'
                }`} 
                size={24}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDetailView = () => {
    const currentStage = stages[activeStage];
    
    return (
      <div 
        className="p-6 rounded-lg shadow-md border-t-4 mb-6"
        style={{ borderTopColor: currentStage.color }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-2">{currentStage.title}</h2>
            <p className="text-gray-600">{currentStage.description}</p>
          </div>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: currentStage.color }}
          >
            {currentStage.icon}
          </div>
        </div>
        
        {/* Flow chart visualization */}
        <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-center">Implementation Flow</h3>
          <div ref={flowChartRef} className="w-full h-auto" style={{ minHeight: "240px" }}></div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center text-orange-800">
              <AlertTriangle size={18} className="mr-2" />
              Challenges Addressed
            </h3>
            <ul className="space-y-2">
              {currentStage.challenges.map((challenge, i) => (
                <li key={i} className="flex items-center text-orange-700">
                  <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center text-blue-800">
              <Database size={18} className="mr-2" />
              Implementation Components
            </h3>
            <ul className="space-y-2">
              {currentStage.components.map((component, i) => (
                <li key={i} className="flex items-center text-blue-700">
                  <Database size={16} className="mr-2 flex-shrink-0" />
                  <span>{component}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center text-green-800">
              <Check size={18} className="mr-2" />
              Business Outcomes
            </h3>
            <ul className="space-y-2">
              {currentStage.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-center text-green-700">
                  <Check size={16} className="mr-2 flex-shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Implementation Effort</h4>
            <div className="flex items-center">
              {renderMetricBar(currentStage.effort, 5, currentStage.color)}
              <span className="ml-2 text-gray-700">{currentStage.effort}/5</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Technical Complexity</h4>
            <div className="flex items-center">
              {renderMetricBar(currentStage.complexity, 5, currentStage.color)}
              <span className="ml-2 text-gray-700">{currentStage.complexity}/5</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Business Value</h4>
            <div className="flex items-center">
              {renderMetricBar(currentStage.businessValue, 5, currentStage.color)}
              <span className="ml-2 text-gray-700">{currentStage.businessValue}/5</span>
            </div>
          </div>
        </div>
        
        {/* Code implementation section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Implementation Code</h3>
            <button 
              className="px-3 py-1 rounded text-sm text-white"
              style={{ backgroundColor: currentStage.color }}
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          
          {showCode && (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-700">
                <button 
                  className={`px-4 py-2 text-sm ${codeSection === 'collector' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setCodeSection('collector')}
                >
                  Collector Config
                </button>
                <button 
                  className={`px-4 py-2 text-sm ${codeSection === 'instrumentation' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setCodeSection('instrumentation')}
                >
                  Instrumentation
                </button>
              </div>
              <pre className="p-4 text-white text-sm overflow-auto max-h-80">
                {currentStage.code[codeSection]}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            className="px-4 py-2 rounded-full text-white flex items-center transition-all hover:shadow-lg"
            style={{ backgroundColor: currentStage.color }}
            onClick={() => {
              if (activeStage < stages.length - 1) {
                setActiveStage(activeStage + 1);
              } else {
                setActiveStage(0);
              }
            }}
          >
            {activeStage < stages.length - 1 ? (
              <>
                <ArrowRight size={18} className="mr-2" />
                Next Stage
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Start Over
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderComparisonChart = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Implementation Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-gray-50">Stage</th>
                <th className="border p-2 text-left bg-gray-50">Implementation</th>
                <th className="border p-2 text-left bg-gray-50">Effort</th>
                <th className="border p-2 text-left bg-gray-50">Complexity</th>
                <th className="border p-2 text-left bg-gray-50">Business Value</th>
                <th className="border p-2 text-left bg-gray-50">Key Benefit</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setActiveStage(index)}
                >
                  <td className="border p-2">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                        style={{ backgroundColor: stage.color }}
                      >
                        {index + 1}
                      </div>
                      Stage {index + 1}
                    </div>
                  </td>
                  <td className="border p-2">{stage.title.split('-')[1].trim()}</td>
                  <td className="border p-2">{renderMetricBar(stage.effort, 5, stage.color)}</td>
                  <td className="border p-2">{renderMetricBar(stage.complexity, 5, stage.color)}</td>
                  <td className="border p-2">{renderMetricBar(stage.businessValue, 5, stage.color)}</td>
                  <td className="border p-2">{stage.outcomes[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAISystemDiagram = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Why AI Systems Need Observability</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Unique Challenges</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <GitBranch size={18} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">Non-deterministic behavior</span>
                  <p className="text-sm text-gray-600">The same input can produce different outputs</p>
                </div>
              </li>
              <li className="flex items-start">
                <GitBranch size={18} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">Complex reasoning chains</span>
                  <p className="text-sm text-gray-600">Multi-step processes with branching decision paths</p>
                </div>
              </li>
              <li className="flex items-start">
                <GitBranch size={18} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">Unpredictable execution</span>
                  <p className="text-sm text-gray-600">Agents may take different approaches each time</p>
                </div>
              </li>
              <li className="flex items-start">
                <Wrench size={18} className="mr-2 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">Tool usage patterns</span>
                  <p className="text-sm text-gray-600">Interactions with external systems that impact results</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Debugging Comparison</h4>
            
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <h5 className="font-medium text-red-800 mb-2">Without Observability</h5>
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-medium mr-2 mt-1">User</div>
                <div>"Why did my agent give the wrong answer?"</div>
              </div>
              <div className="flex items-start mt-2">
                <div className="bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-medium mr-2 mt-1">Dev</div>
                <div>"Let me dig through 500 pages of LLM output..."</div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h5 className="font-medium text-green-800 mb-2">With Observability</h5>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium mr-2 mt-1">User</div>
                <div>"Why did my agent give the wrong answer?"</div>
              </div>
              <div className="flex items-start mt-2">
                <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium mr-2 mt-1">Dev</div>
                <div>"I can see it used the wrong tool here, then misinterpreted the result."</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          OpenTelemetry for AI Systems: Progressive Implementation Journey
        </h1>
        <p className="text-gray-600">
          A step-by-step approach to implementing observability for AI and LLM applications
        </p>
      </div>
      
      {renderAISystemDiagram()}
      {renderJourney()}
      {renderDetailView()}
      {renderComparisonChart()}
    </div>
  );
};

export default EnhancedOtelViz;