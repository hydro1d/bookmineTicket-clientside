export const getTransportImage = (type: string, fallbackUrl?: string): string => {
  const images: Record<string, string> = {
    bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600', // Premium bus
    train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&q=80&w=600', // Modern train
    flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600', // Airplane
    ferry: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600', // Cruise ferry
  };

  const normalizedType = type?.toLowerCase() || '';
  return images[normalizedType] || fallbackUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600';
};
