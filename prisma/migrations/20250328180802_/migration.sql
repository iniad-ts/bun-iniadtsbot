-- CreateTable
CREATE TABLE "daily_records" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "check_in" TIMESTAMP(6) NOT NULL,
    "check_out" TIMESTAMP(6),
    "is_4f" BOOLEAN NOT NULL,

    CONSTRAINT "daily_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserve" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reserve_date" VARCHAR(255) NOT NULL,
    "has_priority" BOOLEAN NOT NULL,

    CONSTRAINT "reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_discord_id" BIGINT,
    "user_github_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserve" ADD CONSTRAINT "reserve_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
