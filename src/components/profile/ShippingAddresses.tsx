
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import AddAddressDialog from "./AddAddressDialog";
import EditAddressDialog from "./EditAddressDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAddresses } from "@/hooks/useAddresses";

const ShippingAddresses = () => {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddresses();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddAddress = (newAddress: any) => {
    // The dialog generates an ID, but our hook handles it. We'll strip it to be safe/clean.
    const { id, ...addressData } = newAddress;
    addAddress(addressData);
  };

  const handleEditAddress = (id: string, updatedAddress: any) => {
    updateAddress(id, updatedAddress);
  };

  const handleOpenEditDialog = (address: any) => {
    setEditingAddress(address);
    setShowEditDialog(true);
  };

  const handleRemoveAddress = (id: string) => {
    removeAddress(id);
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Shipping Addresses</h2>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
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
                  onClick={() => handleOpenEditDialog(address)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Address</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this address? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveAddress(address.id)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

      <AddAddressDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddAddress={handleAddAddress}
      />

      <EditAddressDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onEditAddress={handleEditAddress}
        address={editingAddress}
      />
    </div>
  );
};

export default ShippingAddresses;
