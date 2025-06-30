
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Home",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true
    },
    {
      id: "2",
      name: "Office",
      street: "456 Business Park",
      city: "Pune",
      state: "Maharashtra", 
      pincode: "411001",
      isDefault: false
    }
  ]);
  const { toast } = useToast();

  const handleAddAddress = () => {
    toast({
      title: "Add Address",
      description: "Address form would open here (Demo)"
    });
  };

  const handleEditAddress = (id: string) => {
    toast({
      title: "Edit Address",
      description: "Address edit form would open here (Demo)"
    });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses => addresses.filter(addr => addr.id !== id));
    toast({
      title: "Address Removed",
      description: "Shipping address has been successfully removed"
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses => 
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
    toast({
      title: "Default Address Updated",
      description: "Default shipping address has been updated"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Shipping Addresses</h2>
        <Button onClick={handleAddAddress} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {addresses.map((address) => (
        <Card key={address.id} className={address.isDefault ? "border-blue-500" : ""}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{address.name}</p>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.street}<br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditAddress(address.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveAddress(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {!address.isDefault && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => handleSetDefault(address.id)}
              >
                Set as Default
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShippingAddresses;
