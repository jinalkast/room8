import useActivateChatbot from '@/app/(main)/chatbot/hooks/useActivateChatbot';
import ChatBotPage from '@/app/(main)/chatbot/page';
import useGetHouse from '@/hooks/useGetHouse';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('@/hooks/useGetHouse');
jest.mock('@/app/(main)/chatbot/hooks/useActivateChatbot');

const queryClient = new QueryClient();

describe('ChatBotPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { isLoading: true, data: null },
      status: 'success'
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ChatBotPage />
      </QueryClientProvider>
    );
    expect(screen.queryAllByText('Update ChatBot Settings')).toBeTruthy();
  });

  test('renders chatbot activation button when inactive', async () => {
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { isLoading: false, data: { chatbotActive: false } },
      status: 'success'
    });
    (useActivateChatbot as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatBotPage />
      </QueryClientProvider>
    );

    expect(screen.getAllByText(/Activate ChatBot/i).length).toBeGreaterThan(1);
  });

  test('renders chatbot settings when active', async () => {
    (useGetHouse as jest.Mock).mockReturnValue({ isLoading: false, data: { chatbotActive: true } });
    render(
      <QueryClientProvider client={queryClient}>
        <ChatBotPage />
      </QueryClientProvider>
    );

    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(1);
  });

  test('activates chatbot on button click', async () => {
    const mutateMock = jest.fn();
    (useGetHouse as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { chatbotActive: false }
    });
    (useActivateChatbot as jest.Mock).mockReturnValue({ mutate: mutateMock });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatBotPage />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mutateMock).toHaveBeenCalled());
  });
});
