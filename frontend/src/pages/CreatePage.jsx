
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleAddProduct = async () => {
    if (
      !newProduct.name.trim() ||
      newProduct.price === "" ||
      !newProduct.description.trim() ||
      !newProduct.image.trim()
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all product details.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    const price = Number(newProduct.price);

    if (!Number.isFinite(price) || price < 0) {
      toast({
        title: "Invalid price",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...newProduct,
          price
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create product");
      }

      toast({
        title: "Product created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error creating product",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={12}>
      <VStack spacing={8}>
        <Heading color="blue.500">
          Create New Product
        </Heading>

        <Box w="full" p={6} shadow="md" borderRadius="lg">
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value
                })
              }
            />

            <Input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value
                })
              }
            />

            <Input
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value
                })
              }
            />

            <Input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  image: e.target.value
                })
              }
            />

            <Button
              colorScheme="blue"
              w="full"
              onClick={handleAddProduct}
              isLoading={loading}
              loadingText="Adding Product"
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default CreatePage;
