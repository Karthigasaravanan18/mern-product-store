
import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  VStack
} from "@chakra-ui/react";

import ProductCard from "../components/ProductCard.jsx";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (signal) => {
    try {
      setError("");

      const response = await fetch("/api/products", { signal });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch products");
      }

      setProducts(result.data);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  return (
    <Container maxW="container.xl" py={12}>
      <Heading
        fontSize="3xl"
        color="blue.500"
        textAlign="center"
        mb={8}
      >
        Current Products 🚀
      </Heading>

      {loading ? (
        <VStack py={10}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading products...</Text>
        </VStack>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : products.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No products found. Add your first product!
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onProductChanged={() => fetchProducts()}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default HomePage;
