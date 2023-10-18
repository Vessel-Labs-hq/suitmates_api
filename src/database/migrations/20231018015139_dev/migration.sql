-- AlterTable
ALTER TABLE "User" ADD COLUMN     "card_last_digit" TEXT,
ADD COLUMN     "card_name" TEXT,
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_payment_method_id" TEXT;
