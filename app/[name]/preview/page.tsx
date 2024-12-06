import { Suspense } from "react";
import { PreviewControls } from "@/components/preview/PreviewControls";
import { getDragonData, getBackgroundsList, getFloorList } from "@/lib/utils";
import { SelectedStage } from "@/lib/utils";
import { redirect } from "next/navigation";
import PreviewLoading from "./loading";

interface PreviewPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{
    form: Promise<string>;
    gender: Promise<"m" | "f" | "n">;
    stage: Promise<"egg" | SelectedStage>;
  }>;
}

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  return (
    <Suspense fallback={<PreviewLoading />}>
      <PreviewContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function PreviewContent({
  params,
  searchParams,
}: PreviewPageProps) {
  const { name } = await params;
  const { form, gender, stage } = await searchParams;
  
  if (!form || !gender || !stage) {
    redirect(`/${name}`);
  }

  // Fetch dragon data here
  const dragon = await getDragonData(name);
  const backgroundsList = await getBackgroundsList();
  const floorList = await getFloorList();

  return (
    <PreviewControls
      name={dragon.name}
      initialForm={form as unknown as string}
      initialGender={gender as unknown as "m" | "f" | "n"}
      initialStage={stage as unknown as "egg" | SelectedStage}
      forms={dragon.forms}
      assets={dragon.assets}
      backgroundsList={backgroundsList}
      floorList={floorList}
    />
  );
}
