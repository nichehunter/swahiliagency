"use client";
import { useEffect, useState } from "react";
import { Button, Image, Pagination, Skeleton, Tooltip } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MediaSkeleton } from "@/components/common/sekeleton/MediaSkeleton";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import { useNotify } from "@/components/common/NotificationProvider";
import {
  loadEventMedia,
  deleteEventMedia,
} from "@/services/agent/eventService";
import { EventMediaAdd } from "./add";

const mediaData = [
  {
    id: 1,
    url: "/assets/images/image4.jpg",
    name: "Main Event Image",
  },
  {
    id: 2,
    url: "/assets/images/image4.jpg",
    name: "Event Image 2",
  },
  {
    id: 3,
    url: "/assets/images/image4.jpg",
    name: "Event Image 3",
  },
  {
    id: 4,
    url: "/assets/images/image4.jpg",
    name: "Event Image 4",
  },
  {
    id: 5,
    url: "/assets/images/image4.jpg",
    name: "Event Image 5",
  },
  {
    id: 6,
    url: "/assets/images/image4.jpg",
    name: "Main Event Image",
  },
  {
    id: 7,
    url: "/assets/images/image4.jpg",
    name: "Event Image 2",
  },
  {
    id: 8,
    url: "/assets/images/image4.jpg",
    name: "Event Image 3",
  },
  {
    id: 9,
    url: "/assets/images/image4.jpg",
    name: "Event Image 4",
  },
  {
    id: 10,
    url: "/assets/images/image4.jpg",
    name: "Event Image 5",
  },
];

export const MediaTab = ({ dataId }) => {
  const [open, setOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const mediaPerPage = 8;
  const startIndex = (mediaPage - 1) * mediaPerPage;
  const paginatedMedia = media.slice(startIndex, startIndex + mediaPerPage);
  const [index, setIndex] = useState(0);
  const confirm = useConfirm();
  const loading = useLoading();
  const notify = useNotify();

  useEffect(() => {
    if (!dataId) return;

    const fetchData = async () => {
      setLoadingData(true);

      try {
        const response = await loadEventMedia(dataId);

        setMedia(response);
      } catch (error) {
        const responseData = error?.response?.data;
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }
        notify.error("Failed to Load Event Media", errorMessage);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [dataId, index]);

  const handleDeleteMedia = (item) => {
    confirm({
      title: "Delete Event Image?",
      content: "Are you sure you want to delete this event image?",
      type: "warning",
      okText: "Yes, Delete",
      cancelText: "No, Cancel",

      onOk: async () => {
        try {
          await loading.run(async () => {
            await deleteEventMedia(dataId, item.id);
          }, "Deleting event image...");

          setIndex((prev) => prev + 1);

          notify.success(
            "Event Image Deleted Successfully",
            "The event image has been deleted successfully.",
          );
        } catch (error) {
          const responseData = error?.response?.data;
          let errorMessage = "Something went wrong. Please try again.";

          if (typeof responseData === "string") {
            errorMessage = responseData;
          } else if (responseData?.error) {
            errorMessage = responseData.error;
          } else if (responseData?.detail) {
            errorMessage = responseData.detail;
          } else if (responseData?.message) {
            errorMessage = responseData.message;
          } else if (typeof responseData === "object") {
            const firstKey = Object.keys(responseData)[0];
            const firstError = responseData[firstKey];
            if (Array.isArray(firstError)) {
              errorMessage = `${firstError[0]}`;
            }
          }
          notify.error("Failed to Delete Event Image", errorMessage);
        }
      },
    });
  };
  return (
    <>
      {loadingData ? (
        <MediaSkeleton />
      ) : (
        <div className="sw-details-content">
          <section className="sw-details-card">
            <div className="sw-details-card-header">
              <div>
                <h2>Media</h2>
                <p>Images and other media</p>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="sw-details-save-action"
                onClick={() => setOpen(true)}
              >
                Add Media
              </Button>
            </div>

            {media.length > 0 ? (
              <>
                <div className="sw-details-media-grid">
                  <Image.PreviewGroup>
                    {paginatedMedia.map((item) => (
                      <div className="sw-details-media-item" key={item.id}>
                        <Image
                          src={item.file}
                          alt={`image-${item.sort_order}`}
                          width="100%"
                          height="100%"
                          preview={{
                            cover: (
                              <div className="sw-details-media-preview">
                                <EyeOutlined />
                                <span>View</span>
                              </div>
                            ),
                          }}
                        />

                        <div className="sw-details-media-overlay">
                          <span className="sw-details-media-name">
                            {item.name}
                          </span>

                          <div className="sw-details-media-actions">
                            <Tooltip title="Delete">
                              <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMedia(item);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Image.PreviewGroup>
                </div>

                {media.length > mediaPerPage && (
                  <div className="sw-details-media-pagination">
                    <Pagination
                      current={mediaPage}
                      pageSize={mediaPerPage}
                      total={media.length}
                      onChange={setMediaPage}
                      showSizeChanger={false}
                      showQuickJumper={false}
                      size="small"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="sw-details-media-empty">
                <div className="sw-details-media-empty-icon">
                  <PictureOutlined />
                </div>

                <strong>No media available</strong>

                <span>Add images or other media to this listing.</span>
              </div>
            )}
          </section>
        </div>
      )}
      <EventMediaAdd
        open={open}
        onClose={() => {
          setOpen(false);
          setIndex((prev) => prev + 1);
        }}
        setIndex={setIndex}
        dataId={dataId}
      />
    </>
  );
};
