import { reviewApi } from "@/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReviewItem } from "./review-item";

export function ReviewList() {
  const { data, refetch } = useQuery({
    queryFn: () => reviewApi.getReviewByShop(),
  });
  const createMutataion = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      refetch();
    },
  });
  const handleReply = (
    content: string,
    product: string,
    review_parent: string
  ) => {
    const data = new FormData();
    data.append("content", content);
    data.append("productId", product);
    data.append("review_parent", review_parent);
    createMutataion.mutate(data);
  };
  return (
    <div className=" rounded-md shadow-sm-50">
      {data?.metadata.map((review) => (
        <ReviewItem
          review={review}
          onSubmit={handleReply}
          key={review._id}
        ></ReviewItem>
      ))}
    </div>
  );
}
