<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171019094856 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `document_accurring`;
            DROP TABLE `document_accurring_row`;
            CREATE TABLE `document_service` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `kontragent_id` INT(6) UNSIGNED DEFAULT NULL,
            `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `unit_id` INT(6) UNSIGNED DEFAULT NULL,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_service_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `document_id` INT(6) UNSIGNED DEFAULT NULL,
            `ground_id` INT(6) UNSIGNED DEFAULT NULL,
            `service_id` INT(6) UNSIGNED DEFAULT NULL,
            `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `price` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `count` DECIMAL(8,3) NOT NULL DEFAULT 0,
            `sum` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_meter_service` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `ground_id` INT(6) UNSIGNED DEFAULT NULL,
            `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `unit_id` INT(6) UNSIGNED DEFAULT NULL,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_meters_service_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `service_id` INT(6) UNSIGNED DEFAULT NULL,
            `document_id` INT(6) UNSIGNED DEFAULT NULL,
            `meter_id` INT(6) UNSIGNED DEFAULT NULL,
            `start_data` DECIMAL(8,3) NOT NULL DEFAULT 0,
            `end_data` DECIMAL(8,3) NOT NULL DEFAULT 0,
            `price` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `sum` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `document_service`;
            DROP TABLE `document_service_row`;
            DROP TABLE `document_meter_service`;
            DROP TABLE `document_meters_service_row`;
            CREATE TABLE `document_accurring` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `kontragent_id` INT(6) UNSIGNED DEFAULT NULL,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_accurring_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `document_id` INT(11) UNSIGNED DEFAULT NULL,
            `service_id` INT(11) UNSIGNED DEFAULT NULL,
            `price` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `period` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `calc_base` DECIMAL(11,3) NOT NULL DEFAULT 0,
            `komment` VARCHAR(255) NOT NULL,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }
}
