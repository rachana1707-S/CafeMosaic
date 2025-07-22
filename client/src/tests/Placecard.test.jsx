import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PlaceCard from '../components/PlaceCard';

describe('PlaceCard Component', () => {
  const mockPlace = {
    properties: {
      place_id: "test123",
      name: 'Test Cafe',
      categories: ['catering.restaurant'],
      formatted: '123 Main St',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      opening_hours: '9 AM - 9 PM',
      contact: {
        phone: '123-456-7890',
      },
    },
    geometry: {
      coordinates: [-71.0589, 42.3601],
    },
  };

  it('calls onAdd when "+" button is clicked and not already added', () => {
    const onAddMock = vi.fn();

    render(
      <PlaceCard
        place={mockPlace}
        selectedTrip={{ id: 1, name: 'Trip 1' }}
        onAdd={onAddMock}
        isAdded={false}
      />
    );

    const addButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addButton);

    expect(onAddMock).toHaveBeenCalledWith(mockPlace);
  });

  it('shows ✓ when place is already added', () => {
    render(
      <PlaceCard
        place={mockPlace}
        selectedTrip={{ id: 1, name: 'Trip 1' }}
        onAdd={vi.fn()}
        isAdded={true}
      />
    );

    expect(screen.getByRole('button', { name: '✓' })).toBeDisabled();
  });
});
