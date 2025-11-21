import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  phone?: string; // Added phone as it's used in checkout
  type?: 'home' | 'work' | 'other'; // Added type for better categorization
}

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { toast } = useToast();

  // Load addresses from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('savedAddresses');
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('Error parsing saved addresses:', error);
      }
    } else {
      // Initialize with default if empty (optional, matching existing behavior)
      const defaultAddress: Address = {
        id: "1",
        name: "Home",
        street: "Beta 2",
        city: "Greater Noida",
        state: "Uttar Pradesh",
        pincode: "400001",
        isDefault: true,
        type: 'home'
      };
      setAddresses([defaultAddress]);
      localStorage.setItem('savedAddresses', JSON.stringify([defaultAddress]));
    }
  }, []);

  // Save addresses to localStorage whenever they change
  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(newAddresses));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: addresses.length === 0 || address.isDefault // Make default if it's the first one
    };
    
    let updatedAddresses = [...addresses];
    
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    updatedAddresses.push(newAddress);
    saveAddresses(updatedAddresses);
    
    toast({
      title: "Address Added",
      description: "New shipping address has been saved successfully."
    });
    
    return newAddress;
  };

  const updateAddress = (id: string, updatedAddress: Partial<Address>) => {
    let newAddresses = addresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, ...updatedAddress };
      }
      return addr;
    });

    if (updatedAddress.isDefault) {
      newAddresses = newAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id ? true : false
      }));
    }

    saveAddresses(newAddresses);
    
    toast({
      title: "Address Updated",
      description: "Shipping address has been updated successfully."
    });
  };

  const removeAddress = (id: string) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    
    if (addressToRemove?.isDefault && addresses.length > 1) {
      toast({
        title: "Cannot Remove Default",
        description: "Please set another address as default first",
        variant: "destructive"
      });
      return false;
    }

    const newAddresses = addresses.filter(addr => addr.id !== id);
    saveAddresses(newAddresses);
    
    toast({
      title: "Address Removed",
      description: "Shipping address has been successfully removed"
    });
    return true;
  };

  const setDefaultAddress = (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    
    saveAddresses(newAddresses);
    
    toast({
      title: "Default Address Updated",
      description: "Default shipping address has been updated"
    });
  };

  return {
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
  };
};
