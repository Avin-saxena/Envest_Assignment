import { useState, useEffect } from 'react';
import Head from 'next/head';
import { newsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import NotificationSystem, { useNotifications } from '../components/NotificationSystem';
import { NewspaperIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { 
  Container, 
  Title, 
  Text, 
  SimpleGrid, 
  Center, 
  Stack, 
  Button,
  Card,
  Group,
  ThemeIcon,
  Skeleton,
  Alert,
  Box,
  Pagination
} from '@mantine/core';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { notifications, addNotification, addNewsAlert, dismissNotification } = useNotifications();

  // Pagination configuration
  const itemsPerPage = 6;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  useEffect(() => {
    fetchGeneralNews();
  }, []);

  const fetchGeneralNews = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to first page when fetching new news
      
      const response = await newsAPI.getGeneralNews();
      const newsData = response.data || [];
      setNews(newsData);
      
      if (newsData.length > 0) {
        const totalSources = Object.keys(response.sourceDistribution || {}).length;
        
        // Check for important news patterns and send smart notifications
        const importantNews = newsData.filter(item => 
          item.title.toLowerCase().includes('breaking') ||
          item.title.toLowerCase().includes('alert') ||
          item.title.toLowerCase().includes('urgent')
        );
        
        if (importantNews.length > 0) {
          addNewsAlert(
            'Breaking News Alert',
            `${importantNews.length} urgent financial updates available`,
            'warning'
          );
        }
      }
    } catch (error) {
      console.error('Error fetching general news:', error);
      setError(error.message);
      addNewsAlert('Failed to Load News', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchGeneralNews();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>General News - Insightfolio</title>
          <meta name="description" content="Latest Indian financial market news and analysis" />
        </Head>

        <Stack gap="xl">
          {/* Header */}
          <Center>
            <Stack align="center" gap="md">
              <Group gap="md">
                <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                  <NewspaperIcon style={{ width: '32px', height: '32px' }} />
                </ThemeIcon>
                <Title order={1} size="2.0rem" fw={700} c="dark">
                  Financial News Dashboard
                </Title>
              </Group>
              <Text size="lg" c="dimmed" ta="center">
                Latest market updates from trusted financial news sources
              </Text>
            </Stack>
          </Center>

          {/* Loading Skeleton */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={48}>
            {[...Array(6)].map((_, index) => (
              <Card 
                key={index} 
                h="400px"
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Card.Section withBorder inheritPadding py="md" bg="gray.0">
                  <Group gap="sm">
                    <Skeleton height={20} width={80} radius="md" />
                    <Skeleton height={14} width={100} />
                  </Group>
                </Card.Section>
                
                <Stack gap="lg" p="lg" style={{ flex: 1 }}>
                  <Skeleton height={24} width="100%" />
                  <Skeleton height={16} width="90%" />
                  
                  <Stack gap="xs">
                    <Skeleton height={12} />
                    <Skeleton height={12} width="85%" />
                    <Skeleton height={12} width="70%" />
                  </Stack>
                  
                  <Box style={{ flex: 1 }} />
                  
                  <Skeleton height={38} width="100%" radius="md" />
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>General News - Insightfolio</title>
        </Head>

        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size="4rem" radius="xl" variant="light" color="red">
              <ExclamationTriangleIcon style={{ width: '2rem', height: '2rem' }} />
            </ThemeIcon>
            <Title order={2} size="xl" ta="center">
              Failed to Load News
            </Title>
            <Text c="dimmed" ta="center" maw={400}>
              {error}
            </Text>
            <Button onClick={handleRetry} color="red" size="md">
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
        <title>General News - Insightfolio</title>
        <meta name="description" content="Latest Indian financial market news and analysis" />
      </Head>

      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />

      <Stack gap="xl">
        {/* Dashboard Header */}
        <Center id="financial-news-dashboard">
          <Stack align="center" gap="md">
            <Group gap="md">
              <ThemeIcon size="xl" radius="md" variant="light" color="brand.6">
                <NewspaperIcon style={{ width: '32px', height: '32px' }} />
              </ThemeIcon>
              <Title order={1} size="2.2rem" fw={700} c="dark">
                Financial News Dashboard
              </Title>
            </Group>
            <Text size="md" c="dimmed" ta="center" maw={700}>
              Real-time Indian market news with AI-powered insights from trusted financial sources
            </Text>
          </Stack>
        </Center>



        {/* News Grid */}
        {news.length > 0 ? (
          <Stack gap="xl">
            <SimpleGrid
              className="news-grid"
              cols={{ base: 1, sm: 2, lg: 3 }}
              spacing={48}
              style={{ 
                alignItems: 'start'
              }}
            >
              {currentNews.map((article, index) => (
                <NewsCard
                  key={article.guid || article.link || index}
                  news={article}
                  showAnalysis={true}
                />
              ))}
            </SimpleGrid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Center py="lg">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={handlePageChange}
                  size="md"
                  radius="md"
                  withEdges
                  color="brand.6"
                />
              </Center>
            )}
          </Stack>
        ) : !loading && (
          <Center py="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size="4rem" radius="xl" variant="light" color="gray">
                <NewspaperIcon style={{ width: '2rem', height: '2rem' }} />
              </ThemeIcon>
              <Title order={2} size="xl" ta="center">
                No News Available
              </Title>
              <Text c="dimmed" ta="center" maw={400}>
                We couldn't find any news articles at the moment. Please check your connection and try again.
              </Text>
              <Button onClick={handleRetry} size="md">
                Refresh News
              </Button>
            </Stack>
          </Center>
        )}

        {/* Information Panel */}
        <Card shadow="sm" padding="xl" radius="md" withBorder bg="brand.0">
          <Group gap="md" align="flex-start">
            <ThemeIcon size="xl" radius="md" variant="light" color="brand.6">
              <ChartBarIcon style={{ width: '24px', height: '24px' }} />
            </ThemeIcon>
            <Stack gap="sm" style={{ flex: 1 }}>
              <Title order={3} size="lg" c="dark">
                Smart Financial News Analysis
              </Title>
              <Text c="dimmed" size="sm" lh={1.6}>
                Our intelligent system curates financial news from Economic Times and LiveMint, 
                providing balanced coverage with AI-powered sentiment analysis. Click "Analyze with AI" 
                on any article to understand market impact and investment implications.
              </Text>
            </Stack>
          </Group>
        </Card>
      </Stack>
    </>
  );
} 