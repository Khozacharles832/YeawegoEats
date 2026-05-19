import { Category } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

type FilterCategory = Partial<Category> & {
  id?: string;
  $id?: string;
  name: string;
};

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState<string>("");

  /* 🔥 Sync active state with URL param */
  useEffect(() => {
    if (searchParams.category) {
      setActive(searchParams.category as string);
    } else {
      setActive("all");
    }
  }, [searchParams.category]);

  const handlePress = (id: string) => {
    setActive(id);

    if (id === "all") {
      router.setParams({ category: undefined });
    } else {
      router.setParams({ category: id });
    }
  };

  const getCategoryId = (item: FilterCategory) => item.id ?? item.name;

  const filterData: FilterCategory[] = categories
    ? [{ id: "all", name: "All", description: "" }, ...categories]
    : [{ id: "all", name: "All", description: "" }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item, index) => `${getCategoryId(item)}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => {
        const categoryId = getCategoryId(item);

        return (
          <TouchableOpacity
            className={cn(
              "filter",
              active === categoryId
                ? "border-[#FF9A10] bg-[#FF9A10]"
                : "border-white/10 bg-[#161616]",
            )}
            onPress={() => handlePress(categoryId)}
          >
            <Text
              className={cn(
                "body-medium",
                active === categoryId ? "text-black" : "text-white/60",
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default React.memo(Filter);
