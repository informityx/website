-- Optional email (phone-only submissions); optional message / default inquiry label
ALTER TABLE "GetInTouchSubmission" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "GetInTouchSubmission" ALTER COLUMN "inquiryType" SET DEFAULT '';
ALTER TABLE "GetInTouchSubmission" ALTER COLUMN "message" SET DEFAULT '';
