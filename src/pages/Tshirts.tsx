"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import log from "loglevel"; // ✅ Integración de loglevel
import Header from "../components/Header";
import Footer from "../components/Footer";
import PolaroidCard from "../components/PolaroidCard";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen_url: string;
  categoria: string;
}

const Tshirts = () => {
  const [tshirts, setTshirts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Uso correcto de la variable de entorno
  const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

  useEffect(() => {
    log.setLevel(import.meta.env.PROD ? "warn" : "debug");

    const fetchTshirts = async () => {
      try {
        log.info("Obteniendo lista de productos desde la API...");

        const response = await axios.get<Producto[]>(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        log.debug("Respuesta de la API:", response.data);

        const filteredTshirts = response.data.filter(
          (product) => product.categoria.toLowerCase() === "camisetas"
        );

        setTshirts(filteredTshirts);
      } catch (err) {
        setError("Error al cargar productos.");
        log.error("🚨 Error al obtener productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTshirts();
  }, [API_URL]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <motion.main
        className="flex-grow container mx-auto px-4 pt-24 pb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          CAMISETAS
        </motion.h1>

        {loading && (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Cargando productos...
          </motion.p>
        )}
        {error && (
          <motion.p
            className="text-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tshirts.map((tshirt) => (
              <motion.div key={tshirt.id} variants={itemVariants}>
                <PolaroidCard
                  id={tshirt.id}
                  imageUrl={tshirt.imagen_url}
                  title={tshirt.nombre}
                  subtitle={`$${tshirt.precio}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Tshirts;
