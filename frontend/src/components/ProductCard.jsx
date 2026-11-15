import { useColorMode } from "@chakra-ui/react";
import { useState } from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  HStack,
  IconButton,
  Button,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

function ProductCard({ product, onProductChanged }) {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    image: product.image
  });

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/products/${product._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updatedProduct,
            price: Number(updatedProduct.price)
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      toast({
        title: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      onClose();
      onProductChanged();
    } catch (error) {
      toast({
        title: "Error updating product",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      const response = await fetch(
        `/api/products/${product._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      toast({
        title: "Product deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true
      });

      onProductChanged();
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <Box
  shadow="lg"
  rounded="lg"
  overflow="hidden"
  bg={colorMode === "light" ? "white" : "gray.700"}
>
        <Image
          src={product.image}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
          fallbackSrc="https://placehold.co/600x400?text=Product+Image"
        />

        <Box p={5}>
          <Heading fontSize="xl" mb={2}>
            {product.name}
          </Heading>

          <Text fontSize="lg" fontWeight="bold" color="blue.500">
            ₹{product.price}
          </Text>

          {product.description && (
            <Text
              color={colorMode === "light" ? "gray.600" : "gray.200"}
              mt={2}
             >
              {product.description}
            </Text>
          )}

          <HStack mt={4}>
            <IconButton
              icon={<EditIcon />}
              aria-label="Edit product"
              colorScheme="blue"
              onClick={onOpen}
            />

            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete product"
              colorScheme="red"
              onClick={handleDelete}
            />
          </HStack>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              {["name", "price", "description", "image"].map(
                (field) => (
                  <Input
                    key={field}
                    placeholder={field}
                    type={field === "price" ? "number" : "text"}
                    value={updatedProduct[field]}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        [field]: e.target.value
                      })
                    }
                  />
                )
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProductCard;
