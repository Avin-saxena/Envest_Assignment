import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPortfolio } from '../utils/portfolio';
import { newsAPI, aiAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import { ChartBarIcon, SparklesIcon, ExclamationTriangleIcon, BriefcaseIcon, ArrowPathIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Badge,
  SimpleGrid,
  Center,
  ThemeIcon,
  Alert,
  Box,
  Paper,
  Transition,
  rem,
  useMantineTheme,
  Grid,
  Skeleton,
  ActionIcon,
  RingProgress,
  Timeline
} from '@mantine/core';

export default function FilteredNews() {
  const [portfolio, setPortfolio] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [portfolioSentiment, setPortfolioSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const theme = useMantineTheme();

  useEffect(() => {
    const savedPortfolio = getPortfolio();
    setPortfolio(savedPortfolio);
    
    if (savedPortfolio.length > 0) {
      fetchFilteredNews(savedPortfolio);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFilteredNews = async (stocks) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsAPI.getFilteredNews(stocks);
      setFilteredNews(response.data || []);
    } catch (error) {
      console.error('Error fetching filtered news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzePortfolioNews = async () => {
    if (filteredNews.length === 0) {
      return;
    }

    setAnalyzing(true);
    try {
      const response = await aiAPI.analyzePortfolio(filteredNews, 10);
      
      setFilteredNews(response.data.analyzedNews || []);
      setPortfolioSentiment(response.data.portfolioSentiment);
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRefresh = () => {
    if (portfolio.length > 0) {
      fetchFilteredNews(portfolio);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <CheckCircleIcon style={{ width: '20px', height: '20px' }} />;
      case 'negative':
        return <XCircleIcon style={{ width: '20px', height: '20px' }} />;
      default:
        return <MinusCircleIcon style={{ width: '20px', height: '20px' }} />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (portfolio.length === 0) {
    return (
      <>
        <Head>
          <title>Filtered News - Envest</title>
          <meta name="description" content="Get news filtered by your portfolio with AI insights" />
        </Head>

        <Center mih="60vh">
          <Stack align="center" gap="xl">
            <Paper radius="xl" p="lg" bg={theme.colors.gray[0]}>
              <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                <BriefcaseIcon style={{ width: '24px', height: '24px' }} />
              </ThemeIcon>
            </Paper>
            <Stack align="center" gap="xs">
              <Title order={3} size="h4" fw={600}>
                No Portfolio Found
              </Title>
              <Text c="dimmed" ta="center" maw={400} size="sm">
                You need to add stocks to your portfolio first to see filtered news and AI insights.
              </Text>
            </Stack>
            <Button
              component={Link}
              href="/portfolio"
              size="sm"
              radius="sm"
              leftSection={<BriefcaseIcon style={{ width: '14px', height: '14px' }} />}
            >
              Set Up Your Portfolio
            </Button>
          </Stack>
        </Center>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Filtered News - Envest</title>
        </Head>

        <Stack gap="xl">
          <Center>
            <Stack align="center" gap="xs">
              <Title order={3} size="h4" fw={600}>
                Portfolio News
              </Title>
              <Text c="dimmed" size="sm">Loading news for your portfolio...</Text>
            </Stack>
          </Center>

          <Stack gap="sm">
            {[...Array(3)].map((_, index) => (
              <Card key={index} shadow="sm" padding="md" radius="md" withBorder>
                <Stack gap="xs">
                  <Skeleton height={16} width="70%" radius="sm" />
                  <Skeleton height={12} width="40%" radius="sm" />
                  <Stack gap={4}>
                    <Skeleton height={10} radius="sm" />
                    <Skeleton height={10} width="85%" radius="sm" />
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Filtered News - Envest</title>
        </Head>

        <Center mih="60vh">
          <Stack align="center" gap="lg">
            <ThemeIcon size={48} radius="xl" variant="light" color="red">
              <ExclamationTriangleIcon style={{ width: '24px', height: '24px' }} />
            </ThemeIcon>
            <Stack align="center" gap="xs">
              <Title order={3} size="h4" fw={600}>
                Failed to Load News
              </Title>
              <Text c="dimmed" ta="center" maw={400} size="sm">
                {error}
              </Text>
            </Stack>
            <Button onClick={handleRefresh} size="sm" radius="sm">
              Try Again
            </Button>
          </Stack>
        </Center>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Filtered News - Envest</title>
        <meta name="description" content="Get news filtered by your portfolio with AI insights" />
      </Head>

      <Stack gap="xl">
        {/* Compact Header */}
        <Paper
          radius="lg"
          p="sm"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.cyan[5]} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M24 22v-2h-2v2h-2v2h2v2h2v-2h2v-2h-2zm0-20V0h-2v2h-2v2h2v2h2V4h2V2h-2zM4 22v-2H2v2H0v2h2v2h2v-2h2v-2H4zM4 2V0H2v2H0v2h2v2h2V4h2V2H4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          
          <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
            <Group gap="xs">
              <ThemeIcon size={36} radius="sm" variant="white" color="blue">
                <ChartBarIcon style={{ width: '20px', height: '20px' }} />
              </ThemeIcon>
              <Stack gap={2}>
                <Title order={3} size={rem(20)} fw={600}>
                  Portfolio News & AI Insights
                </Title>
                <Text size="xs" fw={400} opacity={0.9}>
                  News filtered for your {portfolio.length} stocks with AI-powered analysis
                </Text>
              </Stack>
            </Group>
            
            <Paper bg="white" c="dark" py={4} px="sm" radius="sm" shadow="xs">
              <Group gap={4}>
                <Text size="lg" fw={600}>{filteredNews.length}</Text>
                <Text size="xs" c="dimmed">Articles</Text>
              </Group>
            </Paper>
          </Group>
        </Paper>

        {/* Portfolio and Sentiment Cards */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder h="100%">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="sm" variant="light" color="blue">
                      <BriefcaseIcon style={{ width: '16px', height: '16px' }} />
                    </ThemeIcon>
                    <Text size="md" fw={600}>Your Portfolio</Text>
                  </Group>
                  <ActionIcon
                    component={Link}
                    href="/portfolio"
                    variant="light"
                    color="blue"
                    size="sm"
                    radius="sm"
                  >
                    <PencilIcon style={{ width: '12px', height: '12px' }} />
                  </ActionIcon>
                </Group>
                
                                 <Group gap="xs">
                   {portfolio.map((stock) => (
                     <Paper
                       key={stock}
                       p="xs"
                       radius="sm"
                       withBorder
                       sx={(theme) => ({
                         borderColor: theme.colors.gray[3],
                         background: theme.colors.white,
                       })}
                     >
                       <Group spacing={4} wrap="nowrap">
                         <ThemeIcon
                           size={16}
                           radius="sm"
                           variant="light"
                           color="blue"
                         >
                           <ChartBarIcon style={{ width: '10px', height: '10px' }} />
                         </ThemeIcon>
                         <Text size="xs" fw={600}>
                           {stock}
                         </Text>
                       </Group>
                     </Paper>
                   ))}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {portfolioSentiment ? (
              <Card 
                shadow="sm" 
                padding="md" 
                radius="md" 
                withBorder
                h="100%"
                style={{
                  borderColor: theme.colors[getSentimentColor(portfolioSentiment.overall)][2],
                  background: `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors[getSentimentColor(portfolioSentiment.overall)][0]} 100%)`
                }}
              >
                <Stack gap="md" align="center">
                  <Group gap="xs" w="100%">
                    <ThemeIcon 
                      size="md" 
                      radius="sm" 
                      color={getSentimentColor(portfolioSentiment.overall)}
                      variant="filled"
                    >
                      {getSentimentIcon(portfolioSentiment.overall)}
                    </ThemeIcon>
                    <Text size="sm" fw={600}>Overall Sentiment</Text>
                  </Group>
                  
                  <Box style={{ position: 'relative' }}>
                    <RingProgress
                      size={100}
                      thickness={8}
                      roundCaps
                      sections={[
                        { 
                          value: portfolioSentiment.confidence * 100, 
                          color: theme.colors[getSentimentColor(portfolioSentiment.overall)][6],
                          tooltip: `${Math.round(portfolioSentiment.confidence * 100)}% confidence`
                        }
                      ]}
                      label={
                        <Stack gap={0} align="center">
                          <Text size="xs" c="dimmed" fw={500}>
                            {Math.round(portfolioSentiment.confidence * 100)}%
                          </Text>
                                                     <Text size="xs" fw={700} tt="uppercase" c={getSentimentColor(portfolioSentiment.overall)}>
                             {portfolioSentiment.overall}
                           </Text>
                        </Stack>
                      }
                    />
                  </Box>
                  
                  <Paper 
                    p="xs" 
                    radius="sm" 
                    w="100%"
                    style={{ 
                      backgroundColor: theme.colors.gray[0],
                      border: `1px solid ${theme.colors.gray[2]}`
                    }}
                  >
                    <Group gap="xs" justify="space-around">
                      <Stack gap={2} align="center">
                        <ThemeIcon size="xs" color="green" variant="light" radius="sm">
                          <CheckCircleIcon style={{ width: '12px', height: '12px' }} />
                        </ThemeIcon>
                        <Text size="xs" c="green" fw={600}>+{portfolioSentiment.breakdown.positive}</Text>
                      </Stack>
                      <Stack gap={2} align="center">
                        <ThemeIcon size="xs" color="red" variant="light" radius="sm">
                          <XCircleIcon style={{ width: '12px', height: '12px' }} />
                        </ThemeIcon>
                        <Text size="xs" c="red" fw={600}>-{portfolioSentiment.breakdown.negative}</Text>
                      </Stack>
                      <Stack gap={2} align="center">
                        <ThemeIcon size="xs" color="gray" variant="light" radius="sm">
                          <MinusCircleIcon style={{ width: '12px', height: '12px' }} />
                        </ThemeIcon>
                        <Text size="xs" c="gray" fw={600}>={portfolioSentiment.breakdown.neutral}</Text>
                      </Stack>
                    </Group>
                  </Paper>
                </Stack>
              </Card>
            ) : (
              <Card shadow="sm" padding="md" radius="md" withBorder h="100%">
                <Center h="100%">
                  <Stack align="center" gap="sm">
                    <ThemeIcon size="lg" radius="md" variant="light" color="gray">
                      <SparklesIcon style={{ width: '20px', height: '20px' }} />
                    </ThemeIcon>
                    <Button
                      id="analyze-all-button"
                      onClick={analyzePortfolioNews}
                      disabled={analyzing || filteredNews.length === 0}
                      size="xs"
                      radius="sm"
                      loading={analyzing}
                      leftSection={!analyzing && <SparklesIcon style={{ width: '12px', height: '12px' }} />}
                    >
                      Analyze All
                    </Button>
                    <Text size="xs" c="dimmed" ta="center">
                      Analyze news for sentiment
                    </Text>
                  </Stack>
                </Center>
              </Card>
            )}
          </Grid.Col>
        </Grid>

        {/* News Cards */}
        {filteredNews.length > 0 ? (
          <Stack gap="sm">
            {filteredNews.map((article, index) => (
              <Transition
                key={article.guid || article.link || index}
                mounted={true}
                transition="fade-up"
                duration={200}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <NewsCard
                      news={article}
                      showAnalysis={true}
                    />
                  </div>
                )}
              </Transition>
            ))}
          </Stack>
        ) : (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Center py="xl">
              <Stack align="center" gap="lg">
                <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                  <ChartBarIcon style={{ width: '24px', height: '24px' }} />
                </ThemeIcon>
                <Stack align="center" gap="xs">
                  <Title order={4} size="h5" fw={600}>
                    No Relevant News Found
                  </Title>
                  <Text c="dimmed" ta="center" maw={400} size="sm">
                    We couldn't find any news articles related to your portfolio stocks. Try refreshing or check back later.
                  </Text>
                </Stack>
                <Group gap="sm">
                  <Button onClick={handleRefresh} size="sm" radius="sm">
                    Refresh News
                  </Button>
                  <Button
                    component={Link}
                    href="/portfolio"
                    variant="light"
                    size="sm"
                    radius="sm"
                  >
                    Edit Portfolio
                  </Button>
                </Group>
              </Stack>
            </Center>
          </Card>
        )}

        {/* Tips Section */}
        <Alert
          variant="light"
          color="blue"
          radius="md"
          p="md"
          icon={<SparklesIcon style={{ width: '16px', height: '16px' }} />}
          styles={{
            root: {
              backgroundColor: theme.colors.blue[0],
              borderColor: theme.colors.blue[2]
            }
          }}
        >
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              💡 Tips for Better Analysis
            </Text>
            <Timeline bulletSize={16} lineWidth={1} color="blue">
              <Timeline.Item>
                <Text size="xs">Click "Analyze All" for sentiment analysis of all news</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text size="xs">Individual analysis provides detailed reasoning</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text size="xs">Portfolio sentiment shows overall market view</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text size="xs">Add diverse stocks for broader coverage</Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
        </Alert>
      </Stack>
    </>
  );
}