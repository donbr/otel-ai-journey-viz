import React, { useState } from 'react';
import {
  Play,
  AlertTriangle,
  ArrowRight,
  Database,
  Check,
  Zap,
} from 'lucide-react';

const OtelAIJourneyVisualization = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [expandedStages, setExpandedStages] = useState([]);

  const toggleExpand = (index) => {
    if (expandedStages.includes(index)) {
      setExpandedStages(expandedStages.filter((i) => i !== index));
    } else {
      setExpandedStages([...expandedStages, index]);
    }
  };

  const stages = [
    {
      title: 'Stage 1: Quick Win - Basic Setup with TraceZ',
      description:
        "Get immediate visibility into your AI agent's behavior with minimal setup.",
      components: [
        'OpenTelemetry Collector',
        'TraceZ Interface',
        'Basic Instrumentation',
      ],
      challenges: [
        'Limited Visibility',
        'Hard-to-Debug Agents',
        'Unpredictable Behavior',
      ],
      outcomes: [
        'Basic Trace Visualization',
        'Agent Operation Timeline',
        'Simple Debugging',
      ],
      effort: 1,
      complexity: 1,
      businessValue: 2,
      color: '#34D399', // Green
    },
    {
      title: 'Stage 2: Level Up - Custom Configuration',
      description:
        'Enhance your observability with custom attributes and detailed contexts.',
      components: [
        'Custom Configuration',
        'Custom Spans',
        'Context Attributes',
      ],
      challenges: [
        'Reasoning Chain Gaps',
        'Missing Context',
        'Correlation Issues',
      ],
      outcomes: [
        'Detailed Agent Insights',
        'Enhanced Debugging',
        'Better Root Cause Analysis',
      ],
      effort: 2,
      complexity: 2,
      businessValue: 3,
      color: '#60A5FA', // Blue
    },
    {
      title: 'Stage 3: Pro Level - Advanced Visualization',
      description:
        "Achieve production-grade observability with Jaeger's powerful capabilities.",
      components: [
        'Jaeger Integration',
        'Advanced Filtering',
        'Trace Comparison',
      ],
      challenges: [
        'Complex Agent Workflows',
        'Production Scaling',
        'Stakeholder Visibility',
      ],
      outcomes: [
        'Professional Visualization',
        'Cross-Agent Insights',
        'Performance Analysis',
      ],
      effort: 3,
      complexity: 3,
      businessValue: 5,
      color: '#8B5CF6', // Purple
    },
  ];

  const renderMetricBar = (value, maxValue = 5, color) => {
    const bars = [];
    for (let i = 0; i < maxValue; i++) {
      bars.push(
        <div
          key={i}
          className={`h-4 w-6 rounded-sm mx-px ${
            i < value ? 'bg-opacity-100' : 'bg-opacity-20'
          }`}
          style={{ backgroundColor: i < value ? color : '#e5e7eb' }}
        />
      );
    }
    return <div className="flex">{bars}</div>;
  };

  const renderStageCard = (stage, index) => {
    const isActive = activeStage === index;
    const isExpanded = expandedStages.includes(index);

    return (
      <div
        className={`rounded-lg p-4 mb-4 transition-all duration-300 ${
          isActive
            ? 'border-2 shadow-lg'
            : 'border border-gray-200 hover:shadow-md cursor-pointer'
        }`}
        style={{ borderColor: isActive ? stage.color : '#e5e7eb' }}
        onClick={() => setActiveStage(index)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{stage.title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(index);
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        <p className="text-gray-600 mt-2">{stage.description}</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Effort</div>
            {renderMetricBar(stage.effort, 5, stage.color)}
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Complexity</div>
            {renderMetricBar(stage.complexity, 5, stage.color)}
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Business Value</div>
            {renderMetricBar(stage.businessValue, 5, stage.color)}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-1 text-orange-500" />
                Challenges Addressed
              </h4>
              <ul className="text-sm text-gray-600">
                {stage.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start mb-1">
                    <AlertTriangle
                      size={14}
                      className="mr-1 mt-0.5 text-orange-500"
                    />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Database size={16} className="mr-1 text-blue-500" />
                Components
              </h4>
              <ul className="text-sm text-gray-600">
                {stage.components.map((component, i) => (
                  <li key={i} className="flex items-start mb-1">
                    <Database size={14} className="mr-1 mt-0.5 text-blue-500" />
                    {component}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Check size={16} className="mr-1 text-green-500" />
                Outcomes
              </h4>
              <ul className="text-sm text-gray-600">
                {stage.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start mb-1">
                    <Check size={14} className="mr-1 mt-0.5 text-green-500" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJourney = () => {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center mb-8">
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
                index <= activeStage ? 'scale-110 shadow-lg' : 'opacity-70'
              }`}
              style={{ backgroundColor: stage.color }}
              onClick={() => setActiveStage(index)}
            >
              {index + 1}
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
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentStage.color }}
          >
            {activeStage + 1}
          </div>
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
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Implementation Effort
            </h4>
            <div className="flex items-center">
              {renderMetricBar(currentStage.effort, 5, currentStage.color)}
              <span className="ml-2 text-gray-700">
                {currentStage.effort}/5
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Technical Complexity
            </h4>
            <div className="flex items-center">
              {renderMetricBar(currentStage.complexity, 5, currentStage.color)}
              <span className="ml-2 text-gray-700">
                {currentStage.complexity}/5
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Business Value
            </h4>
            <div className="flex items-center">
              {renderMetricBar(
                currentStage.businessValue,
                5,
                currentStage.color
              )}
              <span className="ml-2 text-gray-700">
                {currentStage.businessValue}/5
              </span>
            </div>
          </div>
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          OpenTelemetry for AI Systems: Progressive Implementation Journey
        </h1>
        <p className="text-gray-600">
          A step-by-step approach to implementing observability for AI and LLM
          applications
        </p>
      </div>

      {renderJourney()}
      {renderDetailView()}

      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-4">
          All Implementation Stages
        </h3>
        {stages.map((stage, index) => renderStageCard(stage, index))}
      </div>
    </div>
  );
};

export default OtelAIJourneyVisualization;
