"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FeedbackSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Nhập tối thiểu 10 ký tự.",
    })
    .max(500, {
      message: "Chỉ nhập được tối đa 500 ký tự.",
    }),
});

interface FeedbackForm {
  content: string;
}

const Footer = () => {
  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
  });

  const onSubmit: SubmitHandler<FeedbackForm> = async (
    data: z.infer<typeof FeedbackSchema>
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.success(`Cảm ơn bạn đã đóng góp ý kiến`);

      return response.json();
    } catch (error) {
      toast.error("Có lỗi xảy ra", { description: `${error}` });
    }
  };

  return (
    <div className="flex flex-col gap-4 my-7 max-w-[1840px] w-full self-center">
      <Separator />
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <span className="text-sm text-slate-500">
            Phiên bản:{" "}
            <span className="font-semibold text-slate-500">24.12.1</span>
          </span>
          <span className="text-sm text-slate-500">
            Bản xây: <span className="font-semibold text-slate-500">1.0</span>
          </span>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex gap-4 items-center">
            <span className="text-sm text-slate-500">
              Cung cấp bởi:{" "}
              <span className="font-semibold text-qik-sec-700">
                fantasy.tech
              </span>
            </span>
            <span className="text-sm text-slate-500">
              Kĩ sư:{" "}
              <span className="font-semibold text-rose-700">Oliver Nguyen</span>
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="hover:bg-slate-200 transition-colors duration-300"
                >
                  Đóng góp ý kiến
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đóng góp ý kiến</DialogTitle>
                  <DialogDescription>
                    Mọi ý kiến phản hồi của bạn sé giúp chúng tôi cải thiện.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="flex flex-col items-center gap-3">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                      >
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nội dung</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập nội dung góp ý của bạn vào đây để giúp chúng mình cải thiện ứng dụng ngày càng tốt hơn nhé"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end pt-4 gap-3">
                          <DialogClose asChild>
                            <Button
                              variant={"secondary"}
                              className="hover:bg-slate-200 transition-colors duration-300"
                            >
                              Đóng
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            className="bg-slate-800 hover:bg-slate-600 transition-colors duration-300"
                          >
                            Gửi
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"default"}
                  className="bg-slate-800 hover:bg-slate-600 transition-colors duration-300"
                >
                  Ủng hộ chúng tôi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ủng hộ chúng tôi</DialogTitle>
                  <DialogDescription>
                    Quét mã QR bên dưới bằng ứng dụng Momo
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="flex flex-col items-center gap-3 py-5 bg-slate-100 rounded-2xl">
                    <Image
                      src="/image/donateQR.webp"
                      alt="QR-Code"
                      width={240}
                      height={240}
                    />
                    <Image
                      src="/image/momo_icon.webp"
                      alt="momo"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
