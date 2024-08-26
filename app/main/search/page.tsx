import SearchForm from "@/biz/components/search-form";
import SearchPostList from "@/biz/components/search-post-list";

export default async function SearchPage() {
    return (
        <div className="flex flex-1 flex-col">
            <SearchForm />
            <SearchPostList />
        </div>
    );
}
