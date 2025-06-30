import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType } from '@/types';
const Login = () => {
  const {
    login,
    mockUsers
  } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const handleLogin = async () => {
    if (selectedUser) {
      await login(selectedUser.email, 'demo');
    }
  };
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'supervisor':
        return 'default';
      case 'quality':
        return 'secondary';
      case 'centre_user':
        return 'outline';
      default:
        return 'default';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Plantilla</CardTitle>
          <p className="text-gray-600">Selecciona un usuari per entrar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockUsers.map(user => <div key={user.id} className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'}`} onClick={() => setSelectedUser(user)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.centre}</p>
                  </div>
                </div>
                <Badge variant={getRoleColor(user.role)} className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>)}
          
          <Button onClick={handleLogin} disabled={!selectedUser} className="w-full mt-6">
            Entrar com a {selectedUser?.name}
          </Button>
        </CardContent>
      </Card>
    </div>;
};
export default Login;