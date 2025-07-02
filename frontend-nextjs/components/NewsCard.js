import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowTopRightOnSquareIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { aiAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  Button, 
  ActionIcon,
  Progress,
  Stack,
  Divider,
  Title,
  Anchor,
  Avatar,
  Flex,
  Box,
  Loader
} from '@mantine/core';

const NewsCard = ({ news, showAnalysis = false, onAnalyzeComplete }) => {
  const [analysis, setAnalysis] = useState(news.analysis || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);
  const [isTourRunning, setIsTourRunning] = useState(false);

  // Check if tour is running
  useEffect(() => {
    const checkTourState = () => {
      setIsTourRunning(window.tourIsRunning || false);
    };
    
    checkTourState();
    const interval = setInterval(checkTourState, 100); // Check every 100ms
    
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (analysis) return; // Already analyzed

    setIsAnalyzing(true);
    try {
      const result = await aiAPI.analyzeSingle(
        news.title,
        news.description,
        news.relevantStocks || []
      );
      
      setAnalysis(result.data.analysis);
      toast.success('Analysis completed!');
      
      if (onAnalyzeComplete) {
        onAnalyzeComplete(news, result.data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing news:', error);
      toast.error('Failed to analyze news');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'positive':
        return <CheckCircleIcon className="h-4 w-4 text-emerald-600" />;
      case 'negative':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <MinusCircleIcon className="h-4 w-4 text-slate-500" />;
    }
  };

  const getImpactBadge = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <Card 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid #e5e7eb',
        position: 'relative',
        height: 'fit-content'
      }}
      className={isAnalyzing ? "news-card-hover analyzing-card" : "news-card-hover"}
    >
      {/* Header Section */}
      <Card.Section withBorder inheritPadding py="md" bg="gray.0">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="sm" align="center">
              <Badge 
                variant="filled" 
                color="brand.6" 
                size="sm"
                style={{ fontWeight: 500 }}
              >
                {news.source}
              </Badge>
              <Text size="xs" c="gray.6" fw={500}>
                {formatDate(news.pubDate)}
              </Text>
            </Group>
          </Stack>
          
          <ActionIcon
            component="a"
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray.6"
            size="md"
            style={{ marginTop: '2px' }}
            title="Open in new tab"
          >
            <ArrowTopRightOnSquareIcon style={{ width: '18px', height: '18px' }} />
          </ActionIcon>
        </Group>
      </Card.Section>

      {/* Content Section - Takes remaining space */}
      <Stack gap="md" p="lg" style={{ flex: 1 }}>
        <Title 
          order={4} 
          size="lg" 
          c="gray.8"
          style={{ 
            lineHeight: 1.3,
            fontWeight: 600
          }}
        >
          {news.title}
        </Title>

        {news.description && (
          <Text 
            size="sm" 
            c="gray.6" 
            lineClamp={news.relevantStocks && news.relevantStocks.length > 0 ? 3 : 6}
            style={{ 
              lineHeight: 1.5,
              minHeight: news.relevantStocks && news.relevantStocks.length > 0 ? '4.5em' : '9em'
            }}
          >
            {news.description}
          </Text>
        )}

        {/* Relevant Stocks */}
        {news.relevantStocks && news.relevantStocks.length > 0 && (
          <Box>
            <Text size="xs" fw={600} c="gray.7" mb="sm" tt="uppercase" ls="0.5px">
              Related Stocks
            </Text>
            <Group gap="xs">
              {news.relevantStocks.slice(0, 4).map((stock, index) => (
                <Badge
                  key={stock}
                  variant="outline"
                  color="gray.6"
                  size="sm"
                  style={{ 
                    fontWeight: 500,
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0'
                  }}
                >
                  {stock}
                </Badge>
              ))}
              {news.relevantStocks.length > 4 && (
                <Badge variant="outline" color="gray.5" size="sm">
                  +{news.relevantStocks.length - 4}
                </Badge>
              )}
            </Group>
          </Box>
        )}

        {/* AI Analysis Results - Inline display */}
        {showAnalysis && analysis && (
          <Box mt="sm">
            <Divider color="gray.2" mb={4} />
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <Box
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1c96c5 0%, #4ab4e3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SparklesIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                  </Box>
                  <Text size="sm" fw={600} c="gray.8">AI Analysis</Text>
                </Group>
                
                <Group gap="sm">
                  {getImpactIcon(analysis.impact)}
                  <Badge 
                    variant="light" 
                    color={
                      analysis.impact?.toLowerCase() === 'positive' ? 'green' :
                      analysis.impact?.toLowerCase() === 'negative' ? 'red' : 'gray'
                    }
                    size="sm"
                    style={{ fontWeight: 500 }}
                  >
                    {analysis.impact}
                  </Badge>
                  <ActionIcon
                    variant="subtle"
                    color="gray.6"
                    size="sm"
                    onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isAnalysisExpanded ? (
                      <ChevronUpIcon style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <ChevronDownIcon style={{ width: '16px', height: '16px' }} />
                    )}
                  </ActionIcon>
                </Group>
              </Group>
              
              {isAnalysisExpanded && (
                <Card 
                  withBorder 
                  radius="md" 
                  p="md"
                  className="ai-analysis-content ai-analysis-expanded"
                  style={{ 
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0'
                  }}
                >
                  <Text size="sm" c="gray.7" mb="md" style={{ lineHeight: 1.5 }}>
                    {analysis.reasoning}
                  </Text>
                  
                  <Group justify="space-between" mb="xs">
                    <Text size="xs" c="gray.6" fw={500}>Confidence Level</Text>
                    <Text size="xs" fw={600} c="gray.8">
                      {Math.round((analysis.confidence || 0) * 100)}%
                    </Text>
                  </Group>
                  
                  <Progress 
                    value={(analysis.confidence || 0) * 100} 
                    size="sm" 
                    radius="xl"
                    color="brand.6"
                    style={{
                      backgroundColor: '#e2e8f0'
                    }}
                  />
                </Card>
              )}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Hover Reveal Overlay */}
      {showAnalysis && !analysis && (
        <Box
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            opacity: isAnalyzing || isTourRunning ? 1 : 0,
            transform: isAnalyzing || isTourRunning ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          className={isAnalyzing ? "hover-reveal-button analyzing" : "hover-reveal-button"}
        >
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
            color="brand.6"
            className="analyze-ai-button"
            leftSection={
              isAnalyzing ? (
                <Loader size="sm" color="white" />
              ) : (
                <SparklesIcon style={{ width: '16px', height: '16px' }} />
              )
            }
            style={{
              background: 'linear-gradient(135deg, #1c96c5 0%, #4ab4e3 100%)',
              border: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(28, 150, 197, 0.3)',
              borderRadius: '8px'
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </Button>
        </Box>
      )}


    </Card>
  );
};

export default NewsCard;