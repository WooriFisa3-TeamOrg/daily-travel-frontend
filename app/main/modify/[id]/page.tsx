import ModifyForm from "@/biz/components/modify-form";
import { FC } from "react";

interface PageProps {}

const ModifyPage: FC<PageProps> = async ({}) => {
    return (
        <div className="flex justify-center py-10">
            <ModifyForm />
        </div>
    );
};

export default ModifyPage;
