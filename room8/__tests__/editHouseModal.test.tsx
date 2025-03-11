import { render, screen, fireEvent } from '@testing-library/react';
import EditHouseModal from '@/app/(main)/house-settings/components/edit-house-modal';
import useEditHouse from '@/app/(main)/house-settings/hooks/useEditHouse';
import { THouse } from '@/app/(main)/house-settings/types';

jest.mock('@/app/(main)/house-settings/hooks/useEditHouse', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('EditHouseModal Component', () => {
  const mockHouse: THouse = {
    id: 'house123',
    address: '123 Main St',
    owner: '123',
    name: 'Humble Abode',
    chatbotActive: false,
    cameraId: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal trigger with correct button text', () => {
    (useEditHouse as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<EditHouseModal house={mockHouse} />);

    expect(screen.getByText('Edit Info')).toBeTruthy();
  });

  it('renders modal with correct title and description', () => {
    (useEditHouse as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<EditHouseModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Edit Info'));

    expect(screen.getByText('Edit House Info')).toBeTruthy();
    expect(screen.getByText('Edit name and address of your house')).toBeTruthy();
  });

  it('displays initial house name and address', () => {
    (useEditHouse as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<EditHouseModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Edit Info'));

    expect((screen.getByPlaceholderText('House Name') as HTMLInputElement).value).toEqual(
      'Humble Abode'
    );
    expect((screen.getByPlaceholderText('House Address') as HTMLInputElement).value).toEqual(
      '123 Main St'
    );
  });

  it('updates house name and address on input change', () => {
    (useEditHouse as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<EditHouseModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Edit Info'));

    const nameInput = screen.getByPlaceholderText('House Name') as HTMLInputElement;
    const addressInput = screen.getByPlaceholderText('House Address') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'New House Name' } });
    fireEvent.change(addressInput, { target: { value: '456 Elm St' } });

    expect(nameInput.value).toEqual('New House Name');
    expect(addressInput.value).toEqual('456 Elm St');
  });

  it('calls editHouse with updated house details when edit button is clicked', () => {
    const mockEditHouse = jest.fn();
    (useEditHouse as jest.Mock).mockReturnValue({ mutate: mockEditHouse, isPending: false });

    render(<EditHouseModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Edit Info'));

    fireEvent.change(screen.getByPlaceholderText('House Name'), {
      target: { value: 'New House Name' }
    });
    fireEvent.change(screen.getByPlaceholderText('House Address'), {
      target: { value: '456 Elm St' }
    });

    fireEvent.click(screen.getByText('Edit House'));

    expect(mockEditHouse).toHaveBeenCalledWith({
      house: { name: 'New House Name', address: '456 Elm St' },
      houseId: 'house123'
    });
  });
});
