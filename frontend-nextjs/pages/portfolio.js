import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getPortfolio, savePortfolio, addToPortfolio, removeFromPortfolio, getSuggestedStocks, getPopularStocks } from '../utils/portfolio';
import { BriefcaseIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TrashIcon, ChartBarIcon, NewspaperIcon, SparklesIcon, LinkIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Stack, 
  Group, 
  Button, 
  TextInput, 
  Badge, 
  ActionIcon,
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
  Divider,
  Tooltip,
  RingProgress,
  BackgroundImage,
  Modal
} from '@mantine/core';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    // Load portfolio from localStorage when component mounts
    const savedPortfolio = getPortfolio();
    setPortfolio(savedPortfolio);
  }, []);

  const handleInputChange = (value) => {
    setNewStock(value);
    
    if (value.length > 0) {
      const stockSuggestions = getSuggestedStocks(value);
      setSuggestions(stockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddStock = (stockSymbol = null) => {
    const stockToAdd = stockSymbol || newStock.trim().toUpperCase();
    
    if (!stockToAdd) {
      toast.error('Please enter a stock symbol');
      return;
    }

    if (portfolio.includes(stockToAdd)) {
      toast.error(`${stockToAdd} is already in your portfolio`);
      return;
    }

    setIsLoading(true);
    try {
      const updatedPortfolio = addToPortfolio(stockToAdd);
      setPortfolio(updatedPortfolio);
      setNewStock('');
      setShowSuggestions(false);
    } catch (error) {
      toast.error('Failed to add stock to portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = (stockSymbol) => {
    setIsLoading(true);
    try {
      const updatedPortfolio = removeFromPortfolio(stockSymbol);
      setPortfolio(updatedPortfolio);
    } catch (error) {
      toast.error('Failed to remove stock from portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearPortfolio = () => {
    if (portfolio.length === 0) return;
    setClearModalOpen(true);
  };

  const confirmClearPortfolio = () => {
    savePortfolio([]);
    setPortfolio([]);
    setClearModalOpen(false);
    toast.success('Portfolio cleared successfully');
  };

  const handleSuggestionClick = (stock) => {
    // Handle both string (for backward compatibility) and object formats
    const symbol = typeof stock === 'string' ? stock : stock.symbol;
    handleAddStock(symbol);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStock();
    }
  };

  const popularStocks = getPopularStocks();

  return (
    <>
      <Head>
        <title>Portfolio - Insightfolio</title>
        <meta name="description" content="Manage your stock portfolio and track relevant financial news" />
      </Head>

      <Stack gap="xl">
        {/* Compact Header with Gradient Background */}
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
          {/* Background Pattern */}
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
                <BriefcaseIcon style={{ width: '20px', height: '20px' }} />
              </ThemeIcon>
              <Stack gap={2}>
                <Title order={3} size={rem(20)} fw={600} style={{ letterSpacing: '-0.3px' }}>
                  Portfolio Manager
                </Title>
                <Text size="xs" fw={400} opacity={0.9}>
                  AI-powered insights and targeted news filtering
                </Text>
              </Stack>
            </Group>
            
            {/* Portfolio Stats */}
            <Paper bg="white" c="dark" py={4} px="sm" radius="sm" shadow="xs">
              <Group gap={4}>
                <Text size="lg" fw={600}>{portfolio.length}</Text>
                <Text size="xs" c="dimmed">Stocks</Text>
              </Group>
            </Paper>
          </Group>
        </Paper>

        <Grid gutter="xl">
          {/* Left Column - Add Stock */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              {/* Add Stock Card */}
              <Card shadow="sm" padding="md" radius="md" withBorder id="add-stock-section">
                <Stack gap="sm">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="sm" variant="light" color="blue">
                      <PlusIcon style={{ width: '16px', height: '16px' }} />
                    </ThemeIcon>
                    <Text size="md" fw={600}>
                      Add Stock
                    </Text>
                  </Group>
                  
                  <TextInput
                    placeholder="Enter stock symbol (e.g., RELIANCE)"
                    value={newStock}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStock();
                      }
                    }}
                    rightSection={
                      <ActionIcon 
                        onClick={() => handleAddStock()} 
                        disabled={isLoading || !newStock.trim()}
                        variant="filled"
                        color="blue"
                        size="sm"
                        radius="sm"
                      >
                        <PlusIcon style={{ width: '14px', height: '14px' }} />
                      </ActionIcon>
                    }
                    rightSectionWidth={32}
                    disabled={isLoading}
                    size="sm"
                    radius="sm"
                  />

                  {/* Enhanced Suggestions Dropdown */}
                  <Transition mounted={showSuggestions && suggestions.length > 0} transition="fade-down" duration={200}>
                    {(styles) => (
                      <Paper style={styles} shadow="md" radius="sm" p="xs" withBorder>
                        <Stack gap={2}>
                          {suggestions.map((stock, index) => (
                            <Paper
                              key={stock.symbol || stock}
                              p="xs"
                              radius="sm"
                              sx={(theme) => ({
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: theme.colors.blue[0],
                                  borderColor: theme.colors.blue[3],
                                  transform: 'translateY(-1px)'
                                }
                              })}
                              onClick={() => handleSuggestionClick(stock)}
                              withBorder
                            >
                              <Group justify="space-between" align="center" wrap="nowrap">
                                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                                  <Group gap="xs" align="center">
                                    <Text size="sm" fw={600} c="dark" truncate>
                                      {stock.symbol || stock}
                                    </Text>
                                    {stock.sector && (
                                      <Badge size="xs" variant="light" color="blue" radius="sm">
                                        {stock.sector}
                                      </Badge>
                                    )}
                                  </Group>
                                  {stock.name && (
                                    <Text size="xs" c="dimmed" truncate>
                                      {stock.name}
                                    </Text>
                                  )}
                                </Stack>
                                <ActionIcon size="sm" variant="subtle" color="blue">
                                  <PlusIcon style={{ width: '12px', height: '12px' }} />
                                </ActionIcon>
                              </Group>
                            </Paper>
                          ))}
                        </Stack>
                      </Paper>
                    )}
                  </Transition>
                </Stack>
              </Card>

              {/* Popular Stocks Card */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Stack gap="sm">
                  <Text size="sm" c="dimmed" fw={600}>
                    Popular Stocks
                  </Text>
                  <SimpleGrid cols={2} spacing={8}>
                    {popularStocks.map((stock) => (
                      <Button
                        key={stock}
                        onClick={() => handleAddStock(stock)}
                        disabled={portfolio.includes(stock) || isLoading}
                        variant={portfolio.includes(stock) ? "filled" : "light"}
                        color={portfolio.includes(stock) ? "gray" : "blue"}
                        size="xs"
                        radius="sm"
                        fullWidth
                        compact
                      >
                        {stock}
                        {portfolio.includes(stock) && ' ✓'}
                      </Button>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Right Column - Current Portfolio */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder h="100%">
              <Stack gap="sm" h="100%">
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon size="lg" radius="md" variant="light" color="cyan">
                      <ChartBarIcon style={{ width: '20px', height: '20px' }} />
                    </ThemeIcon>
                    <Text size="md" fw={600}>
                      Current Portfolio
                    </Text>
                  </Group>
                  {portfolio.length > 0 && (
                    <Tooltip label="Clear entire portfolio" withArrow>
                      <ActionIcon
                        onClick={handleClearPortfolio}
                        color="red"
                        variant="light"
                        size="lg"
                        radius="md"
                      >
                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>

                <Divider />

                {portfolio.length > 0 ? (
                  <Box>
                    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs">
                      {portfolio.map((stock, index) => (
                        <Transition
                          key={stock}
                          mounted={true}
                          transition="fade-up"
                          duration={200}
                          timingFunction="ease"
                          exitDuration={200}
                        >
                          {(styles) => (
                            <Paper
                              style={{
                                ...styles,
                                transitionDelay: `${index * 50}ms`
                              }}
                              p="xs"
                              radius="sm"
                              withBorder
                              sx={(theme) => ({
                                borderColor: theme.colors.gray[3],
                                background: theme.colors.white,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: theme.shadows.xs,
                                  borderColor: theme.colors.blue[4],
                                  background: theme.colors.blue[0]
                                }
                              })}
                            >
                              <Group justify="space-between" align="center" spacing={4} wrap="nowrap">
                                <Group spacing={4} wrap="nowrap" style={{ minWidth: 0 }}>
                                  <ThemeIcon
                                    size={16}
                                    radius="sm"
                                    variant="light"
                                    color="blue"
                                    style={{ flexShrink: 0 }}
                                  >
                                    <ChartBarIcon style={{ width: '10px', height: '10px' }} />
                                  </ThemeIcon>
                                  <Text 
                                    size="xs" 
                                    fw={600} 
                                    c="dark" 
                                    truncate
                                    style={{ flexGrow: 1 }}
                                  >
                                    {stock}
                                  </Text>
                                </Group>
                                <ActionIcon
                                  onClick={() => handleRemoveStock(stock)}
                                  disabled={isLoading}
                                  variant="subtle"
                                  color="red"
                                  size="sm"
                                  radius="sm"
                                  style={{ flexShrink: 0 }}
                                >
                                  <XMarkIcon style={{ width: '14px', height: '14px' }} />
                                </ActionIcon>
                              </Group>
                            </Paper>
                          )}
                        </Transition>
                      ))}
                    </SimpleGrid>
                  </Box>
                ) : (
                  <Center py={60} style={{ flex: 1 }}>
                    <Stack align="center" gap="xl">
                      <Paper
                        radius="xl"
                        p="md"
                        bg={theme.colors.gray[0]}
                      >
                        <ThemeIcon size={32} radius="xl" variant="light" color="gray">
                          <BriefcaseIcon style={{ width: '18px', height: '18px' }} />
                        </ThemeIcon>
                      </Paper>
                      <Stack align="center" gap="xs">
                        <Text size="md" fw={600} c="dark">
                          No stocks yet
                        </Text>
                        <Text c="dimmed" ta="center" maw={300} size="xs">
                          Start building your portfolio by adding stocks from the popular list or search for specific ones.
                        </Text>
                      </Stack>
                    </Stack>
                  </Center>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Portfolio Connect Section */}
        <Card
          shadow="sm"
          padding="xl"
          radius="lg"
          withBorder
          style={{
            background: 'white',
            borderColor: theme.colors.gray[2],
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Background Pattern */}
          <Box
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.colors.blue[0]} 0%, transparent 70%)`,
              opacity: 0.5
            }}
          />
          
          <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="sm" color="blue">
                    <LinkIcon style={{ width: '18px', height: '18px' }} />
                  </ThemeIcon>
                  <Text size="lg" fw={600} c="dark">
                    Portfolio Connect
                  </Text>
                  <Badge size="xs" variant="light" color="blue" radius="sm">
                    Beta
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                  Seamlessly sync your real portfolio from your broker account for automated tracking and analysis
                </Text>
              </Stack>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {/* Zerodha Card */}
              <Paper
                p="md"
                radius="md"
                withBorder
                sx={(theme) => ({
                  borderColor: theme.colors.gray[2],
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  background: 'white',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows.md,
                    background: theme.colors.blue[0]
                  }
                })}
                onClick={() => toast('Zerodha integration coming soon!', {
                  icon: '🔜',
                  style: {
                    borderRadius: '10px',
                    background: '#3b82f6',
                    color: '#fff',
                  },
                })}
              >
                <Stack gap="sm">
                  <Group justify="space-between" align="flex-start">
                    <Box
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#387ED1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '18px'
                      }}
                    >
                      Z
                    </Box>
                    <Badge size="xs" variant="light" color="orange" radius="sm">
                      Coming Soon
                    </Badge>
                  </Group>
                  <Stack gap={4}>
                    <Text size="sm" fw={600} c="dark">Zerodha Kite</Text>
                    <Text size="xs" c="dimmed">
                      Connect via Kite Connect API
                    </Text>
                  </Stack>
                  <Group gap="xs" mt="xs">
                    <ThemeIcon size="xs" radius="sm" variant="light" color="gray">
                      <LockClosedIcon style={{ width: '10px', height: '10px' }} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">Sandbox Available</Text>
                  </Group>
                </Stack>
              </Paper>

              {/* Groww Card */}
              <Paper
                p="md"
                radius="md"
                withBorder
                sx={(theme) => ({
                  borderColor: theme.colors.gray[2],
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  background: 'white',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows.md,
                    background: theme.colors.blue[0]
                  }
                })}
                onClick={() => toast('Groww integration coming soon!', {
                  icon: '🔜',
                  style: {
                    borderRadius: '10px',
                    background: '#3b82f6',
                    color: '#fff',
                  },
                })}
              >
                <Stack gap="sm">
                  <Group justify="space-between" align="flex-start">
                    <Box
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#00D09C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '18px'
                      }}
                    >
                      G
                    </Box>
                    <Badge size="xs" variant="light" color="orange" radius="sm">
                      Coming Soon
                    </Badge>
                  </Group>
                  <Stack gap={4}>
                    <Text size="sm" fw={600} c="dark">Groww</Text>
                    <Text size="xs" c="dimmed">
                      Connect via Developer API
                    </Text>
                  </Stack>
                  <Group gap="xs" mt="xs">
                    <ThemeIcon size="xs" radius="sm" variant="light" color="gray">
                      <LockClosedIcon style={{ width: '10px', height: '10px' }} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">Sandbox Available</Text>
                  </Group>
                </Stack>
              </Paper>

              {/* More Coming Soon Card */}
              <Paper
                p="md"
                radius="md"
                withBorder
                sx={(theme) => ({
                  borderColor: theme.colors.gray[2],
                  borderStyle: 'dashed',
                  background: theme.colors.gray[0],
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    background: theme.colors.blue[0]
                  }
                })}
              >
                <Stack gap="sm" align="center" justify="center" h="100%">
                  <ThemeIcon size="lg" radius="md" variant="light" color="gray">
                    <PlusIcon style={{ width: '20px', height: '20px' }} />
                  </ThemeIcon>
                  <Stack gap={4} align="center">
                    <Text size="sm" fw={600} c="dimmed">More Brokers</Text>
                    <Text size="xs" c="dimmed" ta="center">
                      Support for additional brokers coming soon
                    </Text>
                  </Stack>
                </Stack>
              </Paper>
            </SimpleGrid>

            <Alert
              variant="light"
              color="blue"
              radius="md"
              p="md"
              icon={<LockClosedIcon style={{ width: '16px', height: '16px' }} />}
              styles={{
                root: {
                  backgroundColor: theme.colors.blue[0],
                  borderColor: theme.colors.blue[2]
                }
              }}
            >
              <Text size="sm" fw={500}>
                <strong>Secure Integration:</strong> Your credentials are never stored. We use OAuth2 and official broker APIs to ensure your data remains safe.
              </Text>
            </Alert>

            {/* Implementation Guide - Hidden for now, can be shown on click */}
            {/* This is how you'd implement the actual connection:
            <Collapse in={showConnectionGuide}>
              <Paper p="md" radius="md" withBorder bg="gray.0">
                <Stack gap="sm">
                  <Title order={4}>How to Connect:</Title>
                  <Timeline active={1} bulletSize={24} lineWidth={2}>
                    <Timeline.Item bullet={<Text size="xs">1</Text>} title="Get API Key">
                      <Text c="dimmed" size="sm">Login to your broker account and generate API credentials</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<Text size="xs">2</Text>} title="Enter Credentials">
                      <Text c="dimmed" size="sm">Paste your API key and secret in the secure form</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<Text size="xs">3</Text>} title="Authorize">
                      <Text c="dimmed" size="sm">Complete the OAuth flow to grant read-only access</Text>
                    </Timeline.Item>
                  </Timeline>
                </Stack>
              </Paper>
            </Collapse> */}
          </Stack>
        </Card>

        {/* Clear Portfolio Confirmation Modal */}
        <Modal
          opened={clearModalOpen}
          onClose={() => setClearModalOpen(false)}
          title="Clear Portfolio"
          centered
          size="sm"
          radius="md"
        >
          <Stack gap="md">
            <Group gap="xs">
              <ThemeIcon size="lg" radius="md" color="red" variant="light">
                <TrashIcon style={{ width: '20px', height: '20px' }} />
              </ThemeIcon>
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="md" fw={600}>
                  Clear entire portfolio?
                </Text>
                <Text size="sm" c="dimmed">
                  This will permanently remove all {portfolio.length} stocks from your portfolio. This action cannot be undone.
                </Text>
              </Stack>
            </Group>
            
            <Group justify="flex-end" gap="sm" mt="md">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setClearModalOpen(false)}
                radius="sm"
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={confirmClearPortfolio}
                radius="sm"
              >
                Clear Portfolio
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}