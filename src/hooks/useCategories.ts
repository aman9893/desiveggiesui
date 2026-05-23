import { useEffect, useState } from "react";
import api from "../config/api";

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/categories");
                setCategories(data.categories);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};
