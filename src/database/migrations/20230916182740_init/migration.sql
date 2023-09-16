-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "days_of_business" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "hours_of_business_open" TEXT NOT NULL,
    "hours_of_business_close" TEXT NOT NULL,
    "website" TEXT,
    "license" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'tenant',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
