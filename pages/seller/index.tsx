import { statisticApi } from "@/api-client";
import { SellerLayout } from "@/components/layouts/seller";
import { STATUS_ORDER } from "@/constants";
import { useAuth, useClickOutSide } from "@/hooks";
import { getDateAgo, getDayMonthYear } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
const DatePicker = dynamic(import("react-datepicker"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import Link from "next/link";
const generateTitle = (type: string, selectedDate: Date) => {
  if (type === "current")
    return ` Hôm nay: Tới ${new Date().getHours()}:00 hôm nay`;
  if (type === "yesterday")
    return `Hôm qua: ${getDayMonthYear(getDateAgo(1))} `;
  if (type === "7days")
    return `Trong 7 ngày qua: ${getDayMonthYear(
      getDateAgo(7)
    )} - ${getDayMonthYear(getDateAgo(1))} `;
  if (type === "30days")
    return `Trong 30 ngày qua: ${getDayMonthYear(
      getDateAgo(30)
    )} - ${getDayMonthYear(getDateAgo(1))} `;
  if (type === "day") return `Theo ngày: ${getDayMonthYear(selectedDate)} `;
  if (type === "week")
    return `Theo tuần: ${getDayMonthYear(
      startOfWeek(selectedDate, {
        weekStartsOn: 1,
      })
    )} - ${getDayMonthYear(
      endOfWeek(selectedDate, {
        weekStartsOn: 1,
      })
    )} `;
  if (type === "month") {
    const date = new Date(selectedDate);
    return `Theo tháng: ${date.getFullYear()}.${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}`;
  }
  if (type === "year") {
    const date = new Date(selectedDate);
    return `Theo năm: ${date.getFullYear()}`;
  }
};
export default function SellerPage() {
  const { profile } = useAuth();
  const [show, setShow] = useState(false);
  const divRef = useRef(null);
  const [typeDate, setTypeDate] = useState("");
  const [type, setType] = useState("current");
  const [status, setStatus] = useState<"booked" | "confirmed" | "cancelled">(
    "booked"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDateChange = (
    date: Date | [Date | null, Date | null] | null,
    type: string
  ) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
    if (Array.isArray(date) && date.length === 2 && date[0] instanceof Date) {
      setSelectedDate(date[0]);
    }
    setType(type);
    setShow(false);
  };

  useClickOutSide(divRef, () => {
    setShow(false);
  });
  const { data: statisticData } = useQuery({
    queryKey: ["statistic", profile?._id],
    queryFn: statisticApi.getTodoList,
    staleTime: 60,
  });

  const { data: statscOrder } = useQuery({
    queryKey: ["statistic-order", { type, selectedDate, status }],
    queryFn: () => {
      let query: {
        type: string;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        selectedDate?: Date | undefined;
        year?: number | undefined;
        status: "booked" | "confirmed" | "cancelled";
      } = { type, status };
      if (
        (type === "day" || type === "month") &&
        selectedDate instanceof Date
      ) {
        query.selectedDate = selectedDate;
      }
      if (type === "week") {
        query.startDate = startOfWeek(selectedDate, {
          weekStartsOn: 1,
        });
        query.endDate = endOfWeek(selectedDate, {
          weekStartsOn: 1,
        });
      }
      if (type === "year") {
        query.year = new Date(selectedDate).getFullYear();
      }

      return statisticApi.getStatsOrder(query);
    },
    enabled: !!type,
    staleTime: 2 * 60,
  });
  const statisticArray = statisticData?.metadata || [];
  const getNumber = (status: string) => {
    return statisticArray.find((item) => item.status === status)?.count || 0;
  };
  const handleClickOption = (type: string) => {
    setType(type), setShow(false);
  };

  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        // zoomType: "xy",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: statscOrder?.metadata.map((item) => item.key) || [],
      },
      yAxis: {
        title: {
          text: "",
        },
        // labels: {
        //   enabled: false, // Ẩn labels trên trục y
        // },
      },
      legend: {
        reversed: false,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      series: [
        {
          name: "Đơn hàng",
          data: statscOrder?.metadata.map((item) => item.numberOfOrders) || [],
          color: "#e4393c",
        },
        {
          name: "Doanh số",
          data: statscOrder?.metadata.map((item) => item.totalAmount) || [],
          color: "#333",
        },
      ],
    }),
    [statscOrder]
  );
  return (
    <div className="text-xs pl-2 pr-4">
      <div className="p-6 bg-white">
        <div className="text-lg font-bold mb-1">Danh sách việc cần làm</div>
        <p className="text-gray2">Những việc bạn sẽ phải làm</p>
        <div className="mt-8 grid grid-cols-5">
          <Link
            href={`/seller/order?status=${STATUS_ORDER.PENDING}`}
            className="border-r border-gray3 text-center"
          >
            <div className="text-blue text-base">
              {getNumber(STATUS_ORDER.PENDING)}
            </div>
            <div>Chờ Xác Nhận</div>
          </Link>
          <Link
            href={`/seller/order?status=${STATUS_ORDER.CONFIRMED}`}
            className="border-r border-gray3 text-center"
          >
            <div className="text-blue text-base">
              {getNumber(STATUS_ORDER.CONFIRMED)}
            </div>
            <div>Chờ Lấy Hàng</div>
          </Link>
          <Link
            href={`/seller/order?status=${STATUS_ORDER.SHIPPED}`}
            className="border-r border-gray3 text-center"
          >
            <div className="text-blue text-base">
              {getNumber(STATUS_ORDER.SHIPPED)}
            </div>
            <div>Đã Xử Lý</div>
          </Link>
          <Link
            href={`/seller/order?status=${STATUS_ORDER.CANCELLED}`}
            className="border-r border-gray3 text-center"
          >
            <div className="text-blue text-base">
              {getNumber(STATUS_ORDER.CANCELLED)}
            </div>
            <div>Đơn Hủy</div>
          </Link>
          <Link href="/seller/inventory" className=" text-center">
            <div className="text-blue text-base">
              {getNumber("out-of-stock")}
            </div>
            <div>Sản Phẩm Hết Hàng</div>
          </Link>
        </div>
      </div>
      <div className="p-6 bg-white mt-6">
        <div className="text-lg font-bold mb-1">Phân Tích Bán Hàng</div>
        <p className="text-gray2">
          Tổng quan dữ liệu của shop đối với đơn hàng đã xác nhận
        </p>
        <div className="mt-3 text-sm">
          <div className="py-4 px-3 flex items-center gap-x-3">
            Khung thời gian
            <div
              ref={divRef}
              onClick={() => setShow(true)}
              className="py-2 px-3  flex gap-x-2 border relative border-gray4 rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-gray2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              {generateTitle(type, selectedDate)}
              {show && (
                <div className="absolute z-20 bg-gray   top-[calc(100%)] shadow-xl border border-gray3 rounded-md w-[410px]  py-2 left-0 ">
                  <div className="w-[160px] border-gray3 border-r">
                    <div
                      onClick={() => handleClickOption("current")}
                      className="py-1 flex cursor-pointer relative group group hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Hôm nay</span>
                      <div className=" bottom-1 grow absolute hidden  left-[170px] w-[200px] my-auto group-hover:block ">
                        {`Tới ${new Date().getHours()}:00 hôm nay`}
                      </div>
                    </div>
                    <div
                      onClick={() => handleClickOption("yesterday")}
                      className="py-1 flex cursor-pointer relative group group hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Hôm qua</span>
                      <div className=" bottom-1 grow absolute hidden  left-[170px] w-[200px] my-auto group-hover:block ">
                        {getDayMonthYear(getDateAgo(1))}
                      </div>
                    </div>
                    <div
                      onClick={() => handleClickOption("7days")}
                      className="py-1 flex cursor-pointer relative group group hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Trong 7 ngày qua</span>
                      <div className=" bottom-1 grow absolute hidden  left-[170px] w-[200px] my-auto group-hover:block ">
                        {getDayMonthYear(getDateAgo(7))} -{" "}
                        {getDayMonthYear(getDateAgo(1))}
                      </div>
                    </div>
                    <div
                      onClick={() => handleClickOption("30days")}
                      className="py-1 flex cursor-pointer relative group group hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Trong 30 ngày qua</span>
                      <div className=" bottom-1 grow absolute hidden  left-[170px] w-[200px] my-auto group-hover:block ">
                        {getDayMonthYear(getDateAgo(30))} -{" "}
                        {getDayMonthYear(getDateAgo(1))}
                      </div>
                    </div>
                    <div className="my-2 flex h-[1px] w-full bg-gray1"></div>
                  </div>
                  <div className="group">
                    <div
                      onMouseOver={() => setTypeDate("day")}
                      className="py-1 w-[160px]  flex cursor-pointer relative  hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Theo ngày</span>
                    </div>
                    <div
                      onMouseOver={() => setTypeDate("week")}
                      className="py-1 w-[160px] flex cursor-pointer relative  hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Theo tuần</span>
                    </div>
                    <div
                      onMouseOver={() => setTypeDate("month")}
                      className="py-1 w-[160px] flex cursor-pointer relative  hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Theo tháng</span>
                    </div>
                    <div
                      onMouseOver={() => setTypeDate("year")}
                      className="py-1 w-[160px] flex cursor-pointer relative  hover:bg-gray hover:text-orange px-4"
                    >
                      <span>Theo năm</span>
                    </div>

                    {typeDate && (
                      <div className="w-[240px] px-1 group-hover:block hidden absolute left-[160px] top-0">
                        {typeDate === "day" && (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date, "day")}
                            maxDate={new Date()}
                            locale={vi}
                            startDate={selectedDate}
                            endDate={selectedDate}
                            dateFormat="dd/MM/yyyy"
                            inline
                          />
                        )}
                        {typeDate === "week" && (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date, "week")}
                            showWeekNumbers
                            locale={vi}
                            maxDate={new Date()}
                            startDate={startOfWeek(selectedDate, {
                              weekStartsOn: 1,
                            })}
                            endDate={endOfWeek(selectedDate, {
                              weekStartsOn: 1,
                            })}
                            selectsRange
                            inline
                          />
                        )}
                        {typeDate === "month" && (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date, "month")}
                            dateFormat="MM/yyyy" // Định dạng hiển thị chỉ tháng và năm
                            showMonthYearPicker // Hiển thị chỉ tháng và năm
                            inline
                            maxDate={new Date()}
                            locale={vi}
                          />
                        )}
                        {typeDate === "year" && (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => handleDateChange(date, "year")}
                            maxDate={new Date()}
                            dateFormat="yyyy" // Định dạng hiển thị chỉ năm
                            showYearPicker // Hiển thị chỉ năm
                            inline
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="ml-3">Loại Đơn Hàng</span>
            <div className="py-2 w-[150px] px-3 relative group cursor-pointer flex gap-x-2 border border-gray4 rounded-sm">
              {status === "booked"
                ? "Đơn hàng đã đặt"
                : status === "confirmed"
                ? "Đơn đã xác nhận"
                : "Đơn hủy"}
              <div className="absolute overflow-hidden w-full h-0 group-hover:h-[unset] z-10 shadow-lg top-[105%] left-0 bg-white py-1">
                <div
                  className={`p-2 hover:bg-gray ${
                    status === "booked" && "text-orange"
                  }`}
                  onClick={() => setStatus("booked")}
                >
                  Đơn hàng đã đặt
                </div>
                <div
                  className={`p-2 hover:bg-gray ${
                    status === "confirmed" && "text-orange"
                  }`}
                  onClick={() => setStatus("confirmed")}
                >
                  Đơn đã xác nhận
                </div>
                <div
                  className={`p-2 hover:bg-gray ${
                    status === "cancelled" && "text-orange"
                  }`}
                  onClick={() => setStatus("cancelled")}
                >
                  Đơn hủy
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 z-10">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    </div>
  );
}
SellerPage.Layout = SellerLayout;
