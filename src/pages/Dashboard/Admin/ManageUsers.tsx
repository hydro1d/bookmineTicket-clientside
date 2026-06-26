import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  status: 'active' | 'fraud';
}

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id: string, newRole: string) => {
    if (!window.confirm("Change this user's platform role access permissions to: " + newRole + "?")) return;
    try {
      const res = await api.put('/admin/users/' + id + '/role', { role: newRole });
      if (res.data.success) {
        alert("Role updated successfully!");
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleFraud = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'fraud' : 'active';
    if (!window.confirm("Are you sure you want to mark this vendor user status as: " + nextStatus + "?")) return;
    try {
      const res = await api.put('/admin/users/' + id + '/fraud', { status: nextStatus });
      if (res.data.success) {
        alert("Vendor account status successfully set to: " + nextStatus);
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update fraud status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Adjust security permission roles and flag fraud merchant accounts</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Name / Email</th>
                  <th>Platform Role</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userObj) => (
                  <tr key={userObj._id} className="border-b border-slate-100 dark:border-slate-850">
                    <td>
                      <div className="font-bold">{userObj.name}</div>
                      <div className="text-xs text-slate-450">{userObj.email}</div>
                    </td>
                    <td>
                      <select
                        value={userObj.role}
                        onChange={(e) => handleUpdateRole(userObj._id, e.target.value)}
                        className="select select-bordered select-xs bg-slate-50 dark:bg-slate-800 font-bold capitalize text-slate-700 dark:text-slate-200"
                      >
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={"badge font-semibold capitalize border-none " + (
                        userObj.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                      )}>
                        {userObj.status}
                      </span>
                    </td>
                    <td>
                      {userObj.role === 'vendor' && (
                        <button
                          onClick={() => handleToggleFraud(userObj._id, userObj.status)}
                          className={"btn btn-xs rounded-lg flex items-center " + (
                            userObj.status === 'active'
                              ? 'btn-error btn-outline'
                              : 'btn-success text-white'
                          )}
                        >
                          {userObj.status === 'active' ? (
                            <><ShieldAlert className="w-3.5 h-3.5 mr-1" /> Block / Fraud</>
                          ) : (
                            <><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Reactivate</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
