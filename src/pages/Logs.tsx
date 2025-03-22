"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Log {
  id: number;
  nivel: string;
  mensaje: string;
  timestamp: string;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/logs`;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get<Log[]>(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setLogs(response.data);
      } catch (err) {
        setError("Error al cargar logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-6 text-center">📋 Registros de Logs</h1>

        {loading && <p className="text-center">Cargando logs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Nivel</th>
                  <th className="px-4 py-2 text-left">Mensaje</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{log.nivel}</td>
                    <td className="px-4 py-2">{log.mensaje}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LogsPage;
